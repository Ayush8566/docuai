const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

async function parseRepoToDocs(folderPath) {
  const summaries = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (full.endsWith('.js') || full.endsWith('.jsx')) {
        const code = fs.readFileSync(full, 'utf8');
        try {
          parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'classProperties'] });
          summaries.push({ path: full, code: code.slice(0, 500) });
        } catch {
          summaries.push({ path: full, code: code.slice(0, 200) });
        }
      }
    }
  }
  walk(folderPath);
  return summaries;
}

module.exports = { parseRepoToDocs };
