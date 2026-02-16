const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..', '..');
const webDist = path.join(repoRoot, 'web', 'dist');
const publicDir = path.join(repoRoot, 'api', 'public');

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(fromPath, toPath);
    else fs.copyFileSync(fromPath, toPath);
  }
}

if (!fs.existsSync(webDist)) {
  console.error(`web/dist não encontrado em: ${webDist}. Rode 'npm run build --workspace web' primeiro.`);
  process.exit(1);
}

fs.rmSync(publicDir, { recursive: true, force: true });
copyDir(webDist, publicDir);

console.log(`Copiado: ${webDist} -> ${publicDir}`);
