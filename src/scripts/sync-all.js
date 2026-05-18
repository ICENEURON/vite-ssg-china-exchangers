import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scripts = [
  'fetch-data.js',
  'fetch-storage.js',
  'update-locales.js',
  'update-highlighted-articles.js'
];

function runScript(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  console.log(`\n🚀 Running ${scriptName}...`);

  const result = spawnSync('node', [scriptPath], { stdio: 'inherit' });

  if (result.status !== 0) {
    console.error(`\n❌ Error: ${scriptName} failed with exit code ${result.status}`);
    process.exit(1);
  }
}

function main() {
  console.log('🌟 Starting Full Data Sync Process...');
  const start = Date.now();

  scripts.forEach(runScript);

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n✨ Done! All scripts completed successfully in ${duration}s.`);
}

main();
