import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build TypeScript
console.log('Building electron TypeScript files...');
execSync('npx tsc -p tsconfig.node.json', { stdio: 'inherit' });

// Rename .js to .cjs for electron files
const electronDir = path.join(__dirname, 'dist-electron', 'electron');
const files = ['main.js', 'preload.js'];

files.forEach(file => {
  const jsPath = path.join(electronDir, file);
  const cjsPath = path.join(electronDir, file.replace('.js', '.cjs'));
  
  if (fs.existsSync(jsPath)) {
    if (fs.existsSync(cjsPath)) {
      fs.unlinkSync(cjsPath);
    }
    fs.renameSync(jsPath, cjsPath);
    console.log(`Renamed ${file} to ${file.replace('.js', '.cjs')}`);
  }
});

console.log('Electron build complete!');