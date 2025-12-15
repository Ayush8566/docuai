const express = require("express");
const router = express.Router();
const AdmZip = require("adm-zip");
const { nanoid } = require("nanoid");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Documentation = require("../models/Documentation");
const Activity = require("../models/Activity");

let openaiClient = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = require("openai").OpenAI;
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("✅ OpenAI client initialized");
  } catch (err) {
    console.warn("⚠️ OpenAI init failed:", err.message);
  }
}

function astSummarize(code) {
  const parser = require("@babel/parser");
  const traverse = require("@babel/traverse").default;

  try {
    const ast = parser.parse(code, {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript", "classProperties"],
    });

    const functions = new Set();
    const classes = new Set();
    const exports = new Set();

    traverse(ast, {
      FunctionDeclaration(p) {
        if (p.node.id?.name) functions.add(p.node.id.name);
      },
      VariableDeclarator(p) {
        if (
          p.node.id?.name &&
          ["ArrowFunctionExpression", "FunctionExpression"].includes(
            p.node.init?.type
          )
        ) {
          functions.add(p.node.id.name);
        }
      },
      ClassDeclaration(p) {
        if (p.node.id?.name) classes.add(p.node.id.name);
      },
      ExportNamedDeclaration(p) {
        p.node.specifiers?.forEach((s) => {
          if (s.exported?.name) exports.add(s.exported.name);
        });
      },
    });

    return {
      functions: [...functions],
      classes: [...classes],
      exports: [...exports],
    };
  } catch {
    return { functions: [], classes: [], exports: [] };
  }
}


function prepareFilesForPrompt(repoSummary, maxChars = 12000) {
  return repoSummary.map((f) => {
    const code = String(f.code || "");
    const ast = astSummarize(code);

    return {
      path: f.path,
      code:
        code.length > maxChars
          ? code.slice(0, maxChars) + "\n// truncated"
          : code,
      ...ast,
    };
  });
}


function buildMessages(files) {
  const system = `
You are an expert software documentation generator.

RULES:
- Output ONLY valid Markdown
- No explanations, no self references
- Be precise and professional
- If something is missing, say "Not detected from code"

FORMAT (STRICT):

# Project Documentation

## Overview

## Tech Stack

## Folder Structure

## Files Documentation
### <file path>
**Purpose**
**Key Functions**
**Key Classes**
**Exports**
**Notes**

## How to Run

## Limitations
`;

  let user = "Repository files:\n";

  files.forEach((f) => {
    user += `
--------------------
FILE: ${f.path}

Functions: ${f.functions.join(", ") || "None"}
Classes: ${f.classes.join(", ") || "None"}
Exports: ${f.exports.join(", ") || "None"}

CODE:
\`\`\`
${f.code}
\`\`\`
`;
  });

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}


router.post("/generate", protect, async (req, res) => {
  try {
    const repoSummary = req.body?.repoSummary;
    if (!Array.isArray(repoSummary) || repoSummary.length === 0) {
      return res.status(400).json({ message: "repoSummary required" });
    }

    const prepared = prepareFilesForPrompt(repoSummary);
    const messages = buildMessages(prepared);

    if (!openaiClient) {
      return res.json({
        documentation:
          "# Documentation\n\nOpenAI not configured. Unable to generate docs.",
      });
    }

    const response = await openaiClient.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: messages,
      temperature: 0.2,
      max_output_tokens: 3500,
    });

    const output =
      response.output_text || response.output?.[0]?.content?.[0]?.text || "";

    if (!output) throw new Error("Empty AI response");

  
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        activities: {
          $each: [
            {
              type: "GENERATE",
              meta: {
                filesCount: repoSummary.length,
              },
            },
          ],
          $position: 0,
        },
      },
    });

    res.json({ documentation: output });
  } catch (err) {
    console.error("❌ Documentation error:", err);
    res.status(500).json({ message: "Failed to generate documentation" });
  }
});


router.post("/download-zip", protect, async (req, res) => {
  try {
    const docs = req.body?.docs;
    if (!Array.isArray(docs) || docs.length === 0) {
      return res.status(400).json({ message: "No docs provided" });
    }

    const zip = new AdmZip();
    docs.forEach((d) => {
      zip.addFile(
        `${d.filename || "documentation"}.md`,
        Buffer.from(d.text || "", "utf8")
      );
    });

    /* ===== SAVE ACTIVITY ===== */
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        activities: {
          $each: [
            {
              type: "DOWNLOAD",
              meta: {
                count: docs.length,
              },
            },
          ],
          $position: 0,
        },
      },
    });

    res.set("Content-Type", "application/zip");
    res.set(
      "Content-Disposition",
      `attachment; filename="docs-${Date.now()}.zip"`
    );
    res.send(zip.toBuffer());
  } catch (err) {
    console.error("ZIP error:", err);
    res.status(500).json({ message: "ZIP generation failed" });
  }
});
router.post("/save", protect, async (req, res) => {
  try {
    const { repoName, files, documentation, snippet } = req.body;

    const doc = await Documentation.create({
      user: req.user._id,
      repoName,
      files,
      documentation,
      snippet,
    });

    await Activity.create({
      user: req.user._id,
      type: "GENERATE",
      message: `Generated documentation for ${repoName}`,
    });

    res.json({ success: true, doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to save documentation" });
  }
});


router.get("/my", protect, async (req, res) => {
  const docs = await Documentation.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(docs);
});


router.post("/share/:id", protect, async (req, res) => {
  const doc = await Documentation.findById(req.params.id);

  if (!doc || String(doc.user) !== String(req.user._id)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  doc.isPublic = true;
  doc.publicId = nanoid(10);
  await doc.save();

  res.json({
    publicUrl: `${process.env.FRONTEND_URL}/public/${doc.publicId}`,
  });
});


router.get("/public/:publicId", async (req, res) => {
  const doc = await Documentation.findOne({
    publicId: req.params.publicId,
    isPublic: true,
  });

  if (!doc) return res.status(404).json({ message: "Not found" });

  res.json(doc);
});

module.exports = router;
