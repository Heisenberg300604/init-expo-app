const { writeTemplate } = require('../utils/patcher');

const name = 'Environment Config';

async function apply(projectPath, ora) {
  try {
    console.log('📝 Creating .env files...');
    
    const envExample = `# API Configuration
EXPO_PUBLIC_API_URL=https://api.example.com

# App Configuration
EXPO_PUBLIC_APP_NAME=MyApp
EXPO_PUBLIC_APP_ENV=development
`;
    await writeTemplate(projectPath, '.env.example', envExample);
    await writeTemplate(projectPath, '.env', envExample);

    // Create env config helper (TypeScript)
    const envConfig = `/**
 * Environment configuration helper
 * Access environment variables with type safety
 * 
 * In Expo, use EXPO_PUBLIC_ prefix for public env vars
 * Access via process.env.EXPO_PUBLIC_*
 */

interface EnvConfig {
  API_URL: string;
  APP_NAME: string;
  APP_ENV: string;
  isDev: boolean;
  isProd: boolean;
}

export const env: EnvConfig = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'MyApp',
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  isDev: process.env.EXPO_PUBLIC_APP_ENV === 'development',
  isProd: process.env.EXPO_PUBLIC_APP_ENV === 'production',
};

export default env;
`;
    await writeTemplate(projectPath, 'src/config/env.ts', envConfig);

    console.log('✔ Environment config set up');
  } catch (error) {
    console.log('✖ Failed to configure environment');
    throw error;
  }
}

module.exports = { name, apply };
