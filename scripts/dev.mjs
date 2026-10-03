import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const children = ['backend', 'frontend'].map((name) => ({
  name,
  process: spawn(npmCommand, ['run', 'dev'], {
    cwd: resolve(projectRoot, name),
    stdio: 'inherit',
    shell: isWindows,
    detached: !isWindows,
  }),
}));

let stopping = false;

function stopChild(child, signal = 'SIGTERM') {
  if (!child.process.pid || child.process.exitCode !== null) return;

  if (isWindows) {
    spawn('taskkill.exe', ['/PID', String(child.process.pid), '/T', '/F'], {
      stdio: 'ignore',
    });
  } else {
    try {
      process.kill(-child.process.pid, signal);
    } catch {
      child.process.kill(signal);
    }
  }
}

function stopAll(signal = 'SIGTERM') {
  if (stopping) return;
  stopping = true;
  for (const child of children) stopChild(child, signal);
}

for (const child of children) {
  child.process.on('error', (error) => {
    console.error(`Could not start ${child.name}:`, error.message);
    process.exitCode = 1;
    stopAll();
  });

  child.process.on('exit', (code) => {
    if (stopping) return;
    process.exitCode = code ?? 1;
    stopAll();
  });
}

process.on('SIGINT', () => {
  process.exitCode = 130;
  stopAll('SIGINT');
});

process.on('SIGTERM', () => {
  process.exitCode = 143;
  stopAll('SIGTERM');
});
