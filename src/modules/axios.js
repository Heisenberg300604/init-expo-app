const { installDeps } = require('../utils/installer');
const { writeTemplate } = require('../utils/patcher');

const name = 'Axios';

async function apply(projectPath, ora) {
  try {
    console.log('📦 Installing Axios...');
    await installDeps(projectPath, ['axios']);

    // Create API client (TypeScript)
    console.log('📝 Creating API client template...');
    const clientContent = `import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * Axios API client with base configuration
 * Customize baseURL and interceptors as needed
 */
const api: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    // const token = await getToken();
    // if (token) {
    //   config.headers.Authorization = \`Bearer \${token}\`;
    // }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle common errors (401, 500, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
`;
    await writeTemplate(projectPath, 'src/api/client.ts', clientContent);

    // Create example API service (TypeScript)
    const exampleService = `import api from './client';
import { AxiosResponse } from 'axios';

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

/**
 * User service
 */
export const userService = {
  getProfile: (): Promise<AxiosResponse<User>> => api.get('/user/profile'),
  updateProfile: (data: Partial<User>): Promise<AxiosResponse<User>> => api.put('/user/profile', data),
};

/**
 * Auth service
 */
export const authService = {
  login: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/auth/login', credentials),
  logout: (): Promise<AxiosResponse<void>> => api.post('/auth/logout'),
};
`;
    await writeTemplate(projectPath, 'src/api/services.ts', exampleService);

    console.log('✔ Axios configured');
  } catch (error) {
    console.log('✖ Failed to configure Axios');
    throw error;
  }
}

module.exports = { name, apply };
