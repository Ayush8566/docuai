// // // backend/routes/docs.js
// // const express = require("express");
// // const router = express.Router();
// // const AdmZip = require("adm-zip");

// // /**
// //  * POST /api/docs/generate
// //  * Expects: { repoSummary: [ { path: "src/foo.js", code: "..." }, ... ] }
// //  * Returns: { documentation: "### ...", files: [...] }
// //  *
// //  * This is a deterministic test generator so "Generate" works without OpenAI.
// //  * Replace the generator logic with real OpenAI calls later.
// //  */
// // router.post("/generate", async (req, res) => {
// //   try {
// //     const repoSummary = req.body?.repoSummary;
// //     if (!Array.isArray(repoSummary) || repoSummary.length === 0) {
// //       return res
// //         .status(400)
// //         .json({ message: "repoSummary must be a non-empty array" });
// //     }

// //     // Build markdown documentation
// //     const sections = repoSummary.map((f) => {
// //       const path = f.path || "unknown";
// //       const code = (f.code || "").toString();

// //       // Try to extract a short overview:
// //       // 1) block comment at top
// //       // 2) first few meaningful non-empty lines
// //       let overview = "";
// //       const blockComment = code.match(/\/\*([\s\S]{0,800}?)\*\//);
// //       if (blockComment) {
// //         overview = blockComment[1]
// //           .trim()
// //           .split("\n")
// //           .map((l) => l.trim())
// //           .join(" ");
// //       } else {
// //         const lines = code
// //           .split(/\r?\n/)
// //           .map((l) => l.trim())
// //           .filter(Boolean);
// //         overview = lines.slice(0, 6).join(" ");
// //       }
// //       if (!overview) overview = "No brief description available.";

// //       // Grab a snippet (first 40 lines)
// //       const snippet = code.split(/\r?\n/).slice(0, 40).join("\n");

// //       return `### ${path}\n\n**Overview**\n\n${overview}\n\n**Snippet**\n\n\`\`\`\n${snippet}\n\`\`\`\n\n---\n`;
// //     });

// //     const documentation = `# Auto-generated Documentation\n\nThis file was generated locally (test generator). Replace this generator with your AI logic to create production-quality documentation.\n\n${sections.join(
// //       "\n"
// //     )}`;

// //     const files = repoSummary.map((f) => ({
// //       path: f.path || "unknown",
// //       length: (f.code || "").length,
// //     }));

// //     // Return documentation and light metadata
// //     res.json({ documentation, files });
// //   } catch (err) {
// //     console.error("docs.generate error:", err);
// //     res.status(500).json({ message: "Server error", error: String(err) });
// //   }
// // });

// // /**
// //  * POST /api/docs/download-zip
// //  * Expects JSON: { docs: [ { filename: "a.md", text: "..." }, ... ] }
// //  * Returns: zip attachment
// //  */
// // router.post("/download-zip", async (req, res) => {
// //   try {
// //     const docs = req.body?.docs;
// //     if (!Array.isArray(docs) || docs.length === 0) {
// //       return res.status(400).json({ message: "No docs provided" });
// //     }

// //     const zip = new AdmZip();
// //     for (const d of docs) {
// //       const filename = (d.filename || `doc-${Date.now()}.md`)
// //         .toString()
// //         .replace(/[/\\]/g, "_");
// //       const content =
// //         typeof d.text === "string" ? d.text : String(d.text || "");
// //       zip.addFile(filename, Buffer.from(content, "utf8"));
// //     }

// //     const buffer = zip.toBuffer();
// //     res.set("Content-Type", "application/zip");
// //     res.set(
// //       "Content-Disposition",
// //       `attachment; filename="docs-${Date.now()}.zip"`
// //     );
// //     res.send(buffer);
// //   } catch (err) {
// //     console.error("download-zip error", err);
// //     res.status(500).json({ message: "Server error", error: String(err) });
// //   }
// // });

// // module.exports = router;
// // backend/routes/docs.js
// // backend/routes/docs.js
// // backend/routes/docs.js

// // const express = require("express");
// // const router = express.Router();
// // const AdmZip = require("adm-zip");

// // // Optional OpenAI client initialization
// // let openaiClient = null;
// // let OpenAIClass = null;
// // if (process.env.OPENAI_API_KEY) {
// //   try {
// //     OpenAIClass = require("openai").OpenAI;
// //     openaiClient = new OpenAIClass({ apiKey: process.env.OPENAI_API_KEY });
// //     console.log("OpenAI client initialized");
// //   } catch (e) {
// //     console.warn("Failed to initialize OpenAI client:", e.message);
// //     openaiClient = null;
// //   }
// // }

// // /* ---------------- AST-based summarizer ---------------- */
// // // Uses @babel/parser and a small traversal to extract functions/classes and top comments
// // function astSummarize(code) {
// //   const parser = require("@babel/parser");
// //   const traverse = require("@babel/traverse").default;

// //   try {
// //     const ast = parser.parse(code, {
// //       sourceType: "unambiguous",
// //       plugins: ["jsx", "typescript", "classProperties", "decorators-legacy"],
// //     });

// //     const functions = new Set();
// //     const classes = new Set();
// //     const exports = new Set();

// //     traverse(ast, {
// //       FunctionDeclaration(path) {
// //         if (path.node.id && path.node.id.name) functions.add(path.node.id.name);
// //       },
// //       ClassDeclaration(path) {
// //         if (path.node.id && path.node.id.name) classes.add(path.node.id.name);
// //       },
// //       VariableDeclarator(path) {
// //         const id = path.node.id;
// //         const init = path.node.init;
// //         if (
// //           id &&
// //           id.name &&
// //           init &&
// //           (init.type === "ArrowFunctionExpression" ||
// //             init.type === "FunctionExpression")
// //         ) {
// //           functions.add(id.name);
// //         }
// //       },
// //       ExportNamedDeclaration(path) {
// //         if (path.node.declaration) {
// //           const d = path.node.declaration;
// //           if (d.type === "FunctionDeclaration" && d.id)
// //             functions.add(d.id.name);
// //           if (d.type === "ClassDeclaration" && d.id) classes.add(d.id.name);
// //         } else if (path.node.specifiers) {
// //           path.node.specifiers.forEach((s) => {
// //             if (s.exported && s.exported.name) exports.add(s.exported.name);
// //           });
// //         }
// //       },
// //       ExportDefaultDeclaration(path) {
// //         const d = path.node.declaration;
// //         if (d && d.type === "Identifier" && d.name) exports.add(d.name);
// //         else if (d && d.type === "FunctionDeclaration" && d.id)
// //           functions.add(d.id.name);
// //         else if (d && d.type === "ClassDeclaration" && d.id)
// //           classes.add(d.id.name);
// //       },
// //     });

// //     // Try to capture top-of-file block comment or leading line comments as a short summary
// //     const topComment = (() => {
// //       const lines = code.split(/\r?\n/);
// //       let collected = [];
// //       for (let i = 0; i < Math.min(30, lines.length); i++) {
// //         const ln = lines[i].trim();
// //         if (ln.startsWith("/*") || ln.startsWith("/**")) {
// //           // block comment: collect until */
// //           const rest = code.slice(code.indexOf(ln));
// //           const match = rest.match(/\/\*\*?([\s\S]*?)\*\//);
// //           if (match)
// //             return match[1]
// //               .trim()
// //               .split(/\r?\n/)
// //               .map((s) => s.trim())
// //               .join(" ");
// //         }
// //         if (ln.startsWith("//")) {
// //           collected.push(ln.replace(/^\/\/\s?/, ""));
// //         } else if (ln === "") {
// //           continue; // skip blank
// //         } else {
// //           break;
// //         }
// //       }
// //       if (collected.length) return collected.join(" ");
// //       return "";
// //     })();

// //     return {
// //       overview: topComment || "",
// //       functions: Array.from(functions),
// //       classes: Array.from(classes),
// //       exports: Array.from(exports),
// //     };
// //   } catch (err) {
// //     // parsing failed; return best-effort fallback
// //     return { overview: "", functions: [], classes: [], exports: [] };
// //   }
// // }

// // /* ---------------- local fallback generator (non-AI) ---------------- */
// // /**
// //  * localGenerateMarkdown(repoSummary, options)
// //  * options.includeFull (boolean) - if true, include entire file content in snippet
// //  */
// // function localGenerateMarkdown(repoSummary, options = { includeFull: false }) {
// //   const includeFull = !!options.includeFull;
// //   const filesByPath = {};
// //   for (const f of repoSummary) {
// //     const p = (f.path || "unknown").replace(/\\/g, "/");
// //     filesByPath[p] = { path: p, code: String(f.code || "") };
// //   }

// //   let header = "# Project Documentation\n\n";
// //   const readmeKey = Object.keys(filesByPath).find((k) =>
// //     k.toLowerCase().endsWith("readme.md")
// //   );
// //   if (readmeKey) {
// //     header +=
// //       "## Overview (from README)\n\n" +
// //       (filesByPath[readmeKey].code || "").trim() +
// //       "\n\n---\n\n";
// //   } else {
// //     header +=
// //       "This documentation was generated locally. Add a README.md for a richer project overview.\n\n---\n\n";
// //   }

// //   const toc = [];
// //   const sections = [];
// //   const sorted = Object.keys(filesByPath).sort();

// //   for (const p of sorted) {
// //     if (p === readmeKey) continue;
// //     const code = filesByPath[p].code;
// //     const summary = astSummarize(code);

// //     // If includeFull requested, use entire file; otherwise use a large default slice
// //     const snippet =
// //       includeFull === true
// //         ? code
// //         : code.split(/\r?\n/).slice(0, 1000).join("\n"); // up to 1000 lines by default

// //     toc.push(`- [${p}](#${p.replace(/[^\w-]/g, "-")})`);

// //     let sec = `### ${p}\n\n**Overview**\n\n${
// //       summary.overview || "_(no top-level comment found)_"
// //     }\n\n`;
// //     if (summary.functions.length)
// //       sec += `**Functions / Methods**\n\n${summary.functions
// //         .map((fn) => `- \`${fn}()\``)
// //         .join("\n")}\n\n`;
// //     if (summary.classes.length)
// //       sec += `**Classes**\n\n${summary.classes
// //         .map((c) => `- \`${c}\``)
// //         .join("\n")}\n\n`;
// //     if (summary.exports.length)
// //       sec += `**Exports**\n\n${summary.exports
// //         .map((e) => `- \`${e}\``)
// //         .join("\n")}\n\n`;
// //     sec += `**Snippet**\n\n\`\`\`\n${snippet}\n\`\`\`\n\n---\n\n`;
// //     sections.push(sec);
// //   }

// //   return `${header}## Table of Contents\n\n${toc.join(
// //     "\n"
// //   )}\n\n---\n\n${sections.join("\n")}`;
// // }

// // /* ---------------- utility: prepare files to send (truncate & summarize) ---------------- */
// // /**
// //  * prepareFilesForPrompt(repoSummary, perFileChar, maxTotal)
// //  * - If includeFull flag is passed by caller, pass very large perFileChar and maxTotal.
// //  * - Defaults increased to reduce truncation but remain bounded.
// //  */
// // function prepareFilesForPrompt(
// //   repoSummary,
// //   perFileChar = 15000, // increased head length per-file
// //   maxTotal = 300000
// // ) {
// //   const prepared = [];
// //   let total = 0;
// //   for (const f of repoSummary) {
// //     let code = String(f.code || "");
// //     // get AST summary
// //     const ast = astSummarize(code);
// //     // keep head of file for context but limit characters
// //     let snippet = code;
// //     if (snippet.length > perFileChar) {
// //       snippet =
// //         snippet.slice(0, perFileChar) + "\n\n// ...file truncated for prompt";
// //     }
// //     const entry = {
// //       path: f.path,
// //       code: snippet,
// //       overview: ast.overview,
// //       functions: ast.functions,
// //       classes: ast.classes,
// //       exports: ast.exports,
// //     };
// //     prepared.push(entry);
// //     total += snippet.length;
// //     if (total > maxTotal) break;
// //   }
// //   return prepared;
// // }

// // /* ---------------- few-shot examples for system/user prompt ---------------- */
// // function buildMessagesWithFewShot(preparedFiles) {
// //   // system instruction (strict)
// //   const system = `You are DocuAI, an assistant that writes high-quality technical documentation in fluent, professional English.
// // Output MUST be valid Markdown. Start with a top-level title and 1-2 paragraph project overview (use README if present). Then include a Table of Contents and per-file sections. Each file section should contain:
// // - A concise Overview (1-3 sentences),
// // - A Functions / Classes / Exports list if present,
// // - A code snippet or short example,
// // - Mark clearly if any file content was truncated for brevity.
// // Do not include internal commentary about yourself. Keep output concise and factual.`;

// //   // Few-shot example 1 (small)
// //   const exampleUser1 = `Repository files:
// // ---
// // File: src/math.js
// // \`\`\`
// // /**
// //  * Math helpers for the project
// //  */
// // export function add(a,b){ return a+b; }
// // export function sub(a,b){ return a-b; }
// // \`\`\`
// // `;

// //   const exampleAssistant1 = `# Example Project: Math Utilities

// // ## Overview
// // Small library providing math helper functions for other modules.

// // ## Table of Contents
// // - [src/math.js](#src-math-js)

// // ### src/math.js

// // **Overview**

// // Math helper utilities (add, sub) used across project.

// // **Functions / Methods**

// // - \`add()\`
// // - \`sub()\`

// // **Snippet**

// // \`\`\`
// // export function add(a,b){ return a+b; }
// // export function sub(a,b){ return a-b; }
// // \`\`\`
// // `;

// //   // Build user content with prepared files
// //   let userContent = `Repository files (each file includes a small AST-based summary and a code excerpt).\n\n`;
// //   preparedFiles.forEach((f) => {
// //     userContent += `---\nFile: ${f.path}\nOverview: ${
// //       f.overview || "(none)"
// //     }\nFunctions: ${
// //       f.functions.length ? f.functions.join(", ") : "(none)"
// //     }\nClasses: ${
// //       f.classes.length ? f.classes.join(", ") : "(none)"
// //     }\nExports: ${
// //       f.exports.length ? f.exports.join(", ") : "(none)"
// //     }\n\`\`\`\n${f.code}\n\`\`\`\n\n`;
// //   });

// //   userContent += `\nPlease generate a single Markdown documentation file based only on the files above. Do not add anything else.`;

// //   // messages array (system + few-shot assistant + user)
// //   const messages = [
// //     { role: "system", content: system },
// //     { role: "user", content: exampleUser1 },
// //     { role: "assistant", content: exampleAssistant1 },
// //     { role: "user", content: userContent },
// //   ];

// //   return messages;
// // }

// // /* ---------------- streaming helper for OpenAI ---------------- */
// // /**
// //  * Try common streaming methods; write SSE chunks to res.
// //  * This implementation deliberately sets SSE headers in the caller
// //  * (so caller doesn't try to set headers multiple times).
// //  */
// // async function streamOpenAIResponse(openaiClient, messages, res, model) {
// //   // helper to send an SSE-safe chunk (escape newlines)
// //   const sendSSE = (payload) => {
// //     try {
// //       const safe = String(payload).replace(/\n/g, "\\n");
// //       res.write(`data: ${safe}\n\n`);
// //     } catch (err) {
// //       console.error("sendSSE error", err);
// //     }
// //   };

// //   // 1) Try chat.completions.create stream (SDK v4+ shape)
// //   try {
// //     if (typeof openaiClient.chat?.completions?.create === "function") {
// //       const stream = await openaiClient.chat.completions.create({
// //         model,
// //         messages,
// //         temperature: 0.15,
// //         max_tokens: 3500,
// //         stream: true,
// //       });

// //       for await (const part of stream) {
// //         try {
// //           if (part?.choices && part.choices[0]) {
// //             const delta = part.choices[0].delta;
// //             const content =
// //               (delta && (delta.content ?? delta?.message?.content)) || "";
// //             if (content) sendSSE(content);
// //           } else if (typeof part === "string") {
// //             sendSSE(part);
// //           }
// //         } catch (e) {
// //           console.warn("stream part parsing error", e);
// //         }
// //       }

// //       // signal done
// //       res.write("data: [DONE]\n\n");
// //       return { ok: true };
// //     }
// //   } catch (err) {
// //     console.warn(
// //       "chat.completions.create streaming failed:",
// //       err?.message || err
// //     );
// //   }

// //   // 2) Try responses.stream (alternative SDK shapes)
// //   try {
// //     if (typeof openaiClient.responses?.stream === "function") {
// //       const s = await openaiClient.responses.stream({
// //         model,
// //         input: messages.map((m) => `${m.role}: ${m.content}`).join("\n\n"),
// //       });

// //       for await (const part of s) {
// //         try {
// //           if (part.type === "message" && part?.message?.content?.[0]?.text) {
// //             sendSSE(part.message.content[0].text);
// //           } else if (part.type === "response.output_text" && part.text) {
// //             sendSSE(part.text);
// //           }
// //         } catch (e) {
// //           console.warn("responses.stream part parse err", e);
// //         }
// //       }

// //       res.write("data: [DONE]\n\n");
// //       return { ok: true };
// //     }
// //   } catch (err) {
// //     console.warn("responses.stream failed:", err?.message || err);
// //   }

// //   // streaming not available
// //   return { ok: false, reason: "no_stream" };
// // }

// // /* ---------------- Route: POST /api/docs/generate-stream ----------------
// //    Streams generated Markdown to the client as SSE events (data: <chunk>).
// //    The frontend should parse each 'data:' line, append chunks, and stop at [DONE].
// // */
// // router.post("/generate-stream", async (req, res) => {
// //   try {
// //     const repoSummary = req.body?.repoSummary;
// //     if (!Array.isArray(repoSummary) || repoSummary.length === 0) {
// //       return res
// //         .status(400)
// //         .json({ message: "repoSummary must be a non-empty array" });
// //     }

// //     // check includeFull flag from client
// //     const includeFull = !!req.body?.includeFull;

// //     // Prepare AST-based summaries + code excerpts
// //     const prepared = includeFull
// //       ? prepareFilesForPrompt(repoSummary, 200000, 1000000)
// //       : prepareFilesForPrompt(repoSummary);

// //     // Build messages using few-shot examples
// //     const messages = buildMessagesWithFewShot(prepared);

// //     // Choose model - prefer env var if set; otherwise choose sensible default
// //     const preferredModel =
// //       process.env.OPENAI_MODEL && process.env.OPENAI_MODEL.trim()
// //         ? process.env.OPENAI_MODEL.trim()
// //         : process.env.NODE_ENV === "production"
// //         ? "gpt-4"
// //         : "gpt-4o-mini";

// //     // Set SSE headers ONCE
// //     res.setHeader("Content-Type", "text/event-stream");
// //     res.setHeader("Cache-Control", "no-cache, no-transform");
// //     res.setHeader("Connection", "keep-alive");
// //     try {
// //       res.flushHeaders && res.flushHeaders();
// //     } catch (e) {
// //       // ignore
// //     }

// //     if (openaiClient) {
// //       try {
// //         const streamResult = await streamOpenAIResponse(
// //           openaiClient,
// //           messages,
// //           res,
// //           preferredModel
// //         );
// //         if (streamResult.ok) {
// //           // streaming handled and response finished by streamOpenAIResponse
// //           return;
// //         } else {
// //           // inform client streaming not available, will fall back
// //           res.write(
// //             `data: [ERROR] Streaming not available, falling back to local generator\n\n`
// //           );
// //           // fallthrough to local generator below
// //         }
// //       } catch (streamErr) {
// //         console.error("OpenAI streaming failed (caught):", streamErr);
// //         try {
// //           res.write(`data: [ERROR] Streaming failed: ${String(streamErr)}\n\n`);
// //         } catch (e) {}
// //         // fallthrough to local generator fallback
// //       }
// //     } else {
// //       // no openai client
// //       res.write(
// //         `data: [ERROR] OpenAI not configured. Using local generator.\n\n`
// //       );
// //     }

// //     // Fallback (synchronous) generation: local generator
// //     try {
// //       const documentation = localGenerateMarkdown(repoSummary, {
// //         includeFull,
// //       });
// //       res.write(`data: ${documentation.replace(/\n/g, "\\n")}\n\n`);
// //       res.write("data: [DONE]\n\n");
// //     } catch (fallbackErr) {
// //       console.error("Fallback generation error:", fallbackErr);
// //       try {
// //         res.write(
// //           `data: [ERROR] Fallback generation failed: ${String(fallbackErr)}\n\n`
// //         );
// //         res.write("data: [DONE]\n\n");
// //       } catch (e) {
// //         // nothing we can do
// //       }
// //     }
// //   } catch (err) {
// //     console.error("generate-stream error:", err);
// //     try {
// //       res.setHeader("Content-Type", "text/event-stream");
// //       res.setHeader("Cache-Control", "no-cache");
// //       res.setHeader("Connection", "keep-alive");
// //       res.write(`data: [ERROR] ${String(err)}\n\n`);
// //       res.write("data: [DONE]\n\n");
// //     } catch (e) {
// //       // final fallback
// //     }
// //   }
// // });

// // /* ---------------- non-streaming route (for clients that prefer blocking call) ---------------- */
// // router.post("/generate", async (req, res) => {
// //   try {
// //     const repoSummary = req.body?.repoSummary;
// //     if (!Array.isArray(repoSummary) || repoSummary.length === 0) {
// //       return res
// //         .status(400)
// //         .json({ message: "repoSummary must be a non-empty array" });
// //     }

// //     const includeFull = !!req.body?.includeFull;

// //     // If OpenAI available, do single request (non-stream)
// //     if (openaiClient) {
// //       try {
// //         const prepared = includeFull
// //           ? prepareFilesForPrompt(repoSummary, 200000, 1000000)
// //           : prepareFilesForPrompt(repoSummary);
// //         const messages = buildMessagesWithFewShot(prepared);
// //         // Use chat completions create (non-stream)
// //         const model =
// //           process.env.OPENAI_MODEL && process.env.OPENAI_MODEL.trim()
// //             ? process.env.OPENAI_MODEL.trim()
// //             : "gpt-4";
// //         const resp = await openaiClient.chat.completions.create({
// //           model,
// //           messages,
// //           temperature: 0.15,
// //           max_tokens: 3000,
// //         });
// //         // extract text robustly
// //         let text = "";
// //         if (resp?.choices && resp.choices[0]) {
// //           const choice = resp.choices[0];
// //           text =
// //             (choice.message && choice.message.content) || choice.text || "";
// //         } else if (resp?.output?.[0]?.content?.[0]?.text) {
// //           text = resp.output[0].content[0].text;
// //         } else {
// //           text = String(resp);
// //         }
// //         if (!text) throw new Error("OpenAI returned empty response");
// //         return res.json({ documentation: text });
// //       } catch (openErr) {
// //         console.error("OpenAI non-stream error:", openErr);
// //         // fall through to local generator fallback
// //       }
// //     }

// //     // Fallback to local generator
// //     const doc = localGenerateMarkdown(repoSummary, { includeFull });
// //     res.json({ documentation: doc });
// //   } catch (err) {
// //     console.error("generate error:", err);
// //     res.status(500).json({ message: "Server error", error: String(err) });
// //   }
// // });

// // /* ---------------- download-zip (unchanged) ---------------- */
// // router.post("/download-zip", async (req, res) => {
// //   try {
// //     const docs = req.body?.docs;
// //     if (!Array.isArray(docs) || docs.length === 0) {
// //       return res.status(400).json({ message: "No docs provided" });
// //     }

// //     const zip = new AdmZip();
// //     for (const d of docs) {
// //       const filename = (d.filename || `doc-${Date.now()}.md`)
// //         .toString()
// //         .replace(/[/\\]/g, "_");
// //       const content =
// //         typeof d.text === "string" ? d.text : String(d.text || "");
// //       zip.addFile(filename, Buffer.from(content, "utf8"));
// //     }

// //     const buffer = zip.toBuffer();
// //     res.set("Content-Type", "application/zip");
// //     res.set(
// //       "Content-Disposition",
// //       `attachment; filename="docs-${Date.now()}.zip"`
// //     );
// //     res.send(buffer);
// //   } catch (err) {
// //     console.error("download-zip error", err);
// //     res.status(500).json({ message: "Server error", error: String(err) });
// //   }
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const AdmZip = require("adm-zip");

// /* ===================== OPENAI SETUP ===================== */
// let openaiClient = null;
// if (process.env.OPENAI_API_KEY) {
//   try {
//     const OpenAI = require("openai").OpenAI;
//     openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//     console.log("✅ OpenAI client initialized");
//   } catch (err) {
//     console.warn("⚠️ OpenAI init failed:", err.message);
//   }
// }

// /* ===================== AST SUMMARY ===================== */
// function astSummarize(code) {
//   const parser = require("@babel/parser");
//   const traverse = require("@babel/traverse").default;

//   try {
//     const ast = parser.parse(code, {
//       sourceType: "unambiguous",
//       plugins: ["jsx", "typescript", "classProperties"],
//     });

//     const functions = new Set();
//     const classes = new Set();
//     const exports = new Set();

//     traverse(ast, {
//       FunctionDeclaration(p) {
//         if (p.node.id?.name) functions.add(p.node.id.name);
//       },
//       VariableDeclarator(p) {
//         if (
//           p.node.id?.name &&
//           ["ArrowFunctionExpression", "FunctionExpression"].includes(
//             p.node.init?.type
//           )
//         ) {
//           functions.add(p.node.id.name);
//         }
//       },
//       ClassDeclaration(p) {
//         if (p.node.id?.name) classes.add(p.node.id.name);
//       },
//       ExportNamedDeclaration(p) {
//         p.node.specifiers?.forEach((s) => {
//           if (s.exported?.name) exports.add(s.exported.name);
//         });
//       },
//     });

//     return {
//       functions: [...functions],
//       classes: [...classes],
//       exports: [...exports],
//     };
//   } catch {
//     return { functions: [], classes: [], exports: [] };
//   }
// }

// /* ===================== PROMPT PREP ===================== */
// function prepareFilesForPrompt(repoSummary, maxChars = 12000) {
//   return repoSummary.map((f) => {
//     const code = String(f.code || "");
//     const ast = astSummarize(code);

//     return {
//       path: f.path,
//       code:
//         code.length > maxChars
//           ? code.slice(0, maxChars) + "\n// truncated"
//           : code,
//       ...ast,
//     };
//   });
// }

// /* ===================== PROMPT ===================== */
// function buildMessages(files) {
//   const system = `
// You are an expert software documentation generator.

// RULES:
// - Output ONLY valid Markdown
// - No explanations, no self references
// - Be precise and professional
// - If something is missing, say "Not detected from code"

// FORMAT (STRICT):

// # Project Documentation

// ## Overview

// ## Tech Stack

// ## Folder Structure

// ## Files Documentation
// ### <file path>
// **Purpose**
// **Key Functions**
// **Key Classes**
// **Exports**
// **Notes**

// ## How to Run

// ## Limitations
// `;

//   let user = "Repository files:\n";

//   files.forEach((f) => {
//     user += `
// --------------------
// FILE: ${f.path}

// Functions: ${f.functions.join(", ") || "None"}
// Classes: ${f.classes.join(", ") || "None"}
// Exports: ${f.exports.join(", ") || "None"}

// CODE:
// \`\`\`
// ${f.code}
// \`\`\`
// `;
//   });

//   return [
//     { role: "system", content: system },
//     { role: "user", content: user },
//   ];
// }

// /* ===================== GENERATE DOC ===================== */
// router.post("/generate", async (req, res) => {
//   try {
//     const repoSummary = req.body?.repoSummary;
//     if (!Array.isArray(repoSummary) || repoSummary.length === 0) {
//       return res.status(400).json({ message: "repoSummary required" });
//     }

//     const prepared = prepareFilesForPrompt(repoSummary);
//     const messages = buildMessages(prepared);

//     if (!openaiClient) {
//       return res.json({
//         documentation:
//           "# Documentation\n\nOpenAI not configured. Unable to generate docs.",
//       });
//     }

//     const response = await openaiClient.responses.create({
//       model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
//       input: messages,
//       temperature: 0.2,
//       max_output_tokens: 3500,
//     });

//     const output =
//       response.output_text || response.output?.[0]?.content?.[0]?.text || "";

//     if (!output) throw new Error("Empty AI response");

//     res.json({ documentation: output });
//   } catch (err) {
//     console.error("❌ Documentation error:", err);
//     res.status(500).json({ message: "Failed to generate documentation" });
//   }
// });

// /* ===================== DOWNLOAD ZIP ===================== */
// router.post("/download-zip", async (req, res) => {
//   try {
//     const docs = req.body?.docs;
//     if (!Array.isArray(docs) || docs.length === 0) {
//       return res.status(400).json({ message: "No docs provided" });
//     }

//     const zip = new AdmZip();
//     docs.forEach((d) => {
//       zip.addFile(
//         `${d.filename || "documentation"}.md`,
//         Buffer.from(d.text || "", "utf8")
//       );
//     });

//     res.set("Content-Type", "application/zip");
//     res.set(
//       "Content-Disposition",
//       `attachment; filename="docs-${Date.now()}.zip"`
//     );
//     res.send(zip.toBuffer());
//   } catch (err) {
//     console.error("ZIP error:", err);
//     res.status(500).json({ message: "ZIP generation failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const AdmZip = require("adm-zip");
const { nanoid } = require("nanoid");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Documentation = require("../models/Documentation");
const Activity = require("../models/Activity");

/* ===================== OPENAI SETUP ===================== */
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

/* ===================== AST SUMMARY ===================== */
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

/* ===================== PROMPT PREP ===================== */
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

/* ===================== PROMPT ===================== */
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

/* ===================== GENERATE DOC ===================== */
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

    /* ===== SAVE ACTIVITY ===== */
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

/* ===================== DOWNLOAD ZIP ===================== */
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

/* ================= GET MY DOCS ================= */
router.get("/my", protect, async (req, res) => {
  const docs = await Documentation.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(docs);
});

/* ================= SHARE DOC ================= */
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

/* ================= PUBLIC DOC ================= */
router.get("/public/:publicId", async (req, res) => {
  const doc = await Documentation.findOne({
    publicId: req.params.publicId,
    isPublic: true,
  });

  if (!doc) return res.status(404).json({ message: "Not found" });

  res.json(doc);
});

module.exports = router;
