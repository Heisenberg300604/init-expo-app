const fs = require('fs-extra');
const path = require('path');

/**
 * Merge an object into an existing JSON file
 */
async function patchJSON(filePath, patch) {
  const existing = await fs.readJSON(filePath);
  const merged = deepMerge(existing, patch);
  await fs.writeJSON(filePath, merged, { spaces: 2 });
}

/**
 * Write a template file to the project
 */
async function writeTemplate(projectPath, relativePath, content) {
  const fullPath = path.join(projectPath, relativePath);
  await fs.ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, content, 'utf8');
}

/**
 * Append content to a file (useful for babel.config.js patches)
 */
async function appendToFile(filePath, content) {
  const existing = await fs.readFile(filePath, 'utf8');
  await fs.writeFile(filePath, existing + '\n' + content, 'utf8');
}

/**
 * Replace content in a file
 */
async function replaceInFile(filePath, search, replace) {
  let content = await fs.readFile(filePath, 'utf8');
  content = content.replace(search, replace);
  await fs.writeFile(filePath, content, 'utf8');
}

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

module.exports = { 
  patchJSON, 
  writeTemplate, 
  appendToFile, 
  replaceInFile 
};
