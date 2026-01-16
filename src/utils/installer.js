const { spawn } = require('child_process');

/**
 * Execute a command and return a promise
 */
function execCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    // Join args for shell execution to avoid escaping issues
    const fullCommand = args.length > 0 ? `${command} ${args.join(' ')}` : command;
    
    const proc = spawn(fullCommand, [], {
      stdio: options.stdio || 'inherit',
      cwd: options.cwd || process.cwd(),
      shell: true
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Install regular dependencies with --legacy-peer-deps to avoid version conflicts
 */
async function installDeps(projectPath, deps) {
  if (!deps || deps.length === 0) return;
  
  await execCommand('npm', ['install', '--legacy-peer-deps', ...deps], {
    cwd: projectPath,
    stdio: 'inherit'
  });
}

/**
 * Install dev dependencies with --legacy-peer-deps to avoid version conflicts
 */
async function installDevDeps(projectPath, deps) {
  if (!deps || deps.length === 0) return;
  
  await execCommand('npm', ['install', '-D', '--legacy-peer-deps', ...deps], {
    cwd: projectPath,
    stdio: 'inherit'
  });
}

module.exports = { installDeps, installDevDeps, execCommand };
