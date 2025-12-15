const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const AdmZip = require("adm-zip");
const { parseRepoToDocs } = require("../services/astParser");

const router = express.Router();


const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const TEMP_DIR = path.join(__dirname, "..", "temp");

fs.ensureDirSync(UPLOAD_DIR);
fs.ensureDirSync(TEMP_DIR);


const MAX_ZIP_MB = 20;
const MAX_FILES = 5000;
const PARSE_TIMEOUT_MS = 15000;

const IGNORE_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".cache",
  "coverage",
];

const ALLOWED_EXT = [".js", ".jsx", ".ts", ".tsx", ".json", ".md"];


function isValidSourceFile(filePath) {
  return ALLOWED_EXT.includes(path.extname(filePath).toLowerCase());
}


const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const unique = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_ZIP_MB * 1024 * 1024 },
});


async function safeExtract(zipPath, extractDir) {
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  if (entries.length > MAX_FILES) {
    throw new Error(
      "ZIP contains too many files. Remove node_modules, dist, build, or .git."
    );
  }

  for (const entry of entries) {
    const entryPath = entry.entryName;

    if (IGNORE_DIRS.some((d) => entryPath.split("/").includes(d))) continue;
    if (!entry.isDirectory && !isValidSourceFile(entryPath)) continue;

    const fullPath = path.join(extractDir, entryPath);

    if (!fullPath.startsWith(extractDir)) {
      throw new Error("Invalid ZIP structure detected");
    }

    try {
      if (entry.isDirectory) {
        await fs.ensureDir(fullPath);
      } else {
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, entry.getData());
      }
    } catch (e) {
      console.warn("Skipped file:", entryPath);
    }
  }
}

router.post("/repo", upload.single("repo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No ZIP uploaded (field name must be 'repo')",
    });
  }

  const zipPath = req.file.path;
  const extractDir = path.join(
    TEMP_DIR,
    path.basename(zipPath, path.extname(zipPath))
  );

  try {

    await safeExtract(zipPath, extractDir);

    let docs;
    try {
      docs = await Promise.race([
        parseRepoToDocs(extractDir),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Parsing timeout")),
            PARSE_TIMEOUT_MS
          )
        ),
      ]);
    } catch (parseErr) {
      console.error("❌ Parser crashed:", parseErr);
      return res.status(500).json({
        success: false,
        message:
          "Repository is too large or complex. Upload source-only ZIP (no node_modules).",
      });
    }

    if (!Array.isArray(docs) || docs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid source files found in ZIP",
      });
    }


    res.json({ success: true, docs });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to process ZIP",
    });
  } finally {
    
    setTimeout(async () => {
      try {
        await fs.remove(zipPath);
        await fs.remove(extractDir);
      } catch {}
    }, 1000);
  }
});

module.exports = router;
