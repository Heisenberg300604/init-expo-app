const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

const { runPrompts } = require('./prompts');
const { execCommand } = require('./utils/installer');
const nativewind = require('./modules/nativewind');
const zustand = require('./modules/zustand');
const axiosModule = require('./modules/axios');
const envConfig = require('./modules/envConfig');
const folderStructure = require('./modules/folderStructure');
const navigation = require('./modules/navigation');

/**
 * Main CLI orchestrator
 */
async function run() {
  console.log(chalk.blue.bold('\n🚀 Create Expo Starter\n'));

  // Step 1: Get app name from CLI args
  const cliAppName = process.argv[2];

  // Step 2: Run prompts
  const config = await runPrompts(cliAppName);

  console.log(chalk.dim('\nConfiguration:'));
  console.log(chalk.dim(`  App Name: ${config.appName}`));
  console.log(chalk.dim(`  NativeWind: ${config.useNativeWind ? 'Yes' : 'No'}`));
  console.log(chalk.dim(`  Zustand: ${config.useZustand ? 'Yes' : 'No'}`));
  console.log(chalk.dim(`  Axios: ${config.useAxios ? 'Yes' : 'No'}`));
  console.log(chalk.dim(`  Env Config: ${config.useEnvConfig ? 'Yes' : 'No'}`));
  console.log('');

  // Step 3: Create Expo app with TypeScript template
  console.log(chalk.blue('📦 Creating Expo TypeScript app...'));
  
  try {
    await execCommand('npx', ['create-expo-app@latest', config.appName, '--template', 'blank-typescript'], {
      stdio: 'inherit'
    });
    console.log(chalk.green('✔ Expo TypeScript app created'));
  } catch (err) {
    console.log(chalk.red('✖ Failed to create Expo app'));
    console.error(chalk.red(err.message));
    process.exit(1);
  }

  const projectPath = path.resolve(process.cwd(), config.appName);

  // Step 4: Apply folder structure (always)
  await folderStructure.apply(projectPath, ora);

  // Step 5: Apply navigation (always - since we have screens)
  await navigation.apply(projectPath, ora);

  // Step 6: Apply selected modules
  const modulesToApply = [];

  if (config.useNativeWind) {
    modulesToApply.push(nativewind);
  }
  if (config.useZustand) {
    modulesToApply.push(zustand);
  }
  if (config.useAxios) {
    modulesToApply.push(axiosModule);
  }
  if (config.useEnvConfig) {
    modulesToApply.push(envConfig);
  }

  for (const module of modulesToApply) {
    await module.apply(projectPath, ora);
  }

  // Done!
  console.log('');
  console.log(chalk.green.bold('✅ Your Expo TypeScript app is ready!'));
  console.log('');
  console.log(chalk.white('Next steps:'));
  console.log(chalk.cyan(`  cd ${config.appName}`));
  console.log(chalk.cyan('  npx expo start'));
  console.log('');
}

module.exports = { run };
