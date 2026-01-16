const { installDeps, installDevDeps, execCommand } = require('../utils/installer');
const { writeTemplate, patchJSON } = require('../utils/patcher');
const path = require('path');
const fs = require('fs-extra');

const name = 'NativeWind';

async function apply(projectPath, ora) {
  try {
    // Step 1: Install NativeWind and peer dependencies
    console.log('📦 Installing NativeWind dependencies...');
    
    await installDeps(projectPath, [
      'nativewind',
      'react-native-reanimated',
      'react-native-safe-area-context',
      'react-native-worklets'
    ]);
    
    await installDevDeps(projectPath, [
      'babel-preset-expo',
      'tailwindcss@^3.4.17',
      'prettier-plugin-tailwindcss@^0.5.11'
    ]);

    // Step 2: Create tailwind.config.js
    console.log('📝 Creating Tailwind config...');
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
    await writeTemplate(projectPath, 'tailwind.config.js', tailwindConfig);

    // Step 3: Create global.css
    const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
    await writeTemplate(projectPath, 'global.css', globalCss);

    // Step 4: Create babel.config.js (preserve the expo preset format)
    console.log('📝 Updating Babel config...');
    const babelConfig = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
`;
    await writeTemplate(projectPath, 'babel.config.js', babelConfig);

    // Step 5: Create metro.config.js
    console.log('📝 Creating Metro config...');
    const metroConfig = `const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
`;
    await writeTemplate(projectPath, 'metro.config.js', metroConfig);

    // Step 6: Update app.json for web bundler
    console.log('📝 Updating app.json...');
    const appJsonPath = path.join(projectPath, 'app.json');
    if (await fs.pathExists(appJsonPath)) {
      const appJson = await fs.readJSON(appJsonPath);
      if (!appJson.expo.web) {
        appJson.expo.web = {};
      }
      appJson.expo.web.bundler = 'metro';
      await fs.writeJSON(appJsonPath, appJson, { spaces: 2 });
    }

    // Step 8: Add TypeScript types
    const nativewindEnv = `/// <reference types="nativewind/types" />
`;
    await writeTemplate(projectPath, 'nativewind-env.d.ts', nativewindEnv);

    // Step 9: Run npm install to ensure all babel presets are resolved
    console.log('📦 Reinstalling dependencies to ensure babel presets...');
    await execCommand('npm', ['install'], {
      cwd: projectPath,
      stdio: 'inherit'
    });

    console.log('✔ NativeWind configured');
  } catch (error) {
    console.log('✖ Failed to configure NativeWind');
    throw error;
  }
}

module.exports = { name, apply };
