const inquirer = require('inquirer').default;

/**
 * Run interactive prompts to gather user configuration
 */
async function runPrompts(initialAppName) {
  const questions = [];

  // Only ask for app name if not provided via CLI args
  if (!initialAppName) {
    questions.push({
      type: 'input',
      name: 'appName',
      message: 'What is your app name?',
      validate: (input) => input.trim() ? true : 'App name is required'
    });
  }

  questions.push(
    {
      type: 'confirm',
      name: 'useNativeWind',
      message: 'Add NativeWind (Tailwind CSS for React Native)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'useZustand',
      message: 'Add Zustand (state management)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'useAxios',
      message: 'Add Axios (API client)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'useEnvConfig',
      message: 'Add environment variables support?',
      default: true
    }
  );

  const answers = await inquirer.prompt(questions);

  return {
    appName: initialAppName || answers.appName.trim(),
    useNativeWind: answers.useNativeWind,
    useZustand: answers.useZustand,
    useAxios: answers.useAxios,
    useEnvConfig: answers.useEnvConfig
  };
}

module.exports = { runPrompts };
