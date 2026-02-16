const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const includeDirs = ['src', 'scripts', 'tests'];

function collectFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const nextPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(nextPath, acc);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.js')) {
      acc.push(nextPath);
    }
  }
  return acc;
}

const files = includeDirs.flatMap((dir) => collectFiles(path.join(root, dir)));
let hasError = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) {
    hasError = true;
  }
}

if (hasError) process.exit(1);
console.log(`Syntax check passed for ${files.length} file(s).`);
