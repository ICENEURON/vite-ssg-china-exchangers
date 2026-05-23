import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHOULD_FETCH_DATA = true;
const SHOULD_FETCH_STORAGE = true;
const SHOULD_FETCH_CONTENT = true;
const SHOULD_FETCH_LANGUAGE = true;
const SHOULD_UPDATE_LOCALES = true;
const SHOULD_UPDATE_HIGHLIGHTED_ARTICLES = true;

const scripts = [
  { enabled: SHOULD_FETCH_DATA, name: 'fetch-data.js' },
  { enabled: SHOULD_FETCH_STORAGE, name: 'fetch-storage.js' },
  { enabled: SHOULD_FETCH_CONTENT, name: 'fetch-content.js' },
  { enabled: SHOULD_FETCH_LANGUAGE, name: 'fetch-language.js' },
  { enabled: SHOULD_UPDATE_LOCALES, name: 'update-locales.js' },
  { enabled: SHOULD_UPDATE_HIGHLIGHTED_ARTICLES, name: 'update-highlighted-articles.js' }
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

  for (const script of scripts) {
    if (!script.enabled) {
      console.log(`\n⏭️ Skipping ${script.name}; flag is false.`);
      continue;
    }

    runScript(script.name);
  }

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n✨ Done! All scripts completed successfully in ${duration}s.`);
}

main();
