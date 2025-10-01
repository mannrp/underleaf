import { spawn } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Set environment variable for development
process.env.VITE_DEV_SERVER_URL = 'http://localhost:5173';

// Start Electron
const electronPath = require('electron');
const electronProcess = spawn(electronPath, ['.'], {
  stdio: 'inherit',
  env: { ...process.env }
});

electronProcess.on('close', (code) => {
  process.exit(code);
});