const { spawnSync } = require('child_process');
const r = spawnSync('node', [
  'api/scripts/seed-secretarias.js',
  'https://www.transpjardim.com',
  'franciscodesenvolve',
  'Platao3914$Mouse'
], { stdio: 'inherit', shell: false });
process.exit(r.status || 0);
