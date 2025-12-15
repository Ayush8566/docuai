const fs = require("fs-extra");
const path = require("path");
const parser = require("@babel/parser");


const MAX_FILES = 500; 
const MAX_FILE_SIZE = 200 * 1024; // 200 KB per file
const MAX_DEPTH = 8; // folder depth limit

const ALLOWED_EXT = [".js", ".jsx", ".ts", ".tsx"];
const IGNORE_DIRS = ["node_modules", ".git", "__pycache__", "dist", "build"];


async function parseRepoToDocs(rootDir) {
  const summaries = [];
  let fileCount = 0;

  async function walk(dir, depth = 0) {
    if (depth > MAX_DEPTH) return;
    if (fileCount >= MAX_FILES) return;

    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (fileCount >= MAX_FILES) break;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (IGNORE_DIRS.includes(entry.name)) continue;
        await walk(fullPath, depth + 1);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (!ALLOWED_EXT.includes(ext)) continue;

        let stat;
        try {
          stat = await fs.stat(fullPath);
        } catch {
          continue;
        }

       
        if (stat.size > MAX_FILE_SIZE) continue;

        let code;
        try {
          code = await fs.readFile(fullPath, "utf8");
        } catch {
          continue;
        }

       
        try {
          parser.parse(code, {
            sourceType: "unambiguous",
            plugins: ["jsx", "classProperties", "typescript"],
          });
        } catch {
        
        }

        summaries.push({
          path: path.relative(rootDir, fullPath),
          code: code.slice(0, 800), // keep small snippet
        });

        fileCount++;
      }
    }
  }

  await walk(rootDir);
  return summaries;
}

module.exports = { parseRepoToDocs };
