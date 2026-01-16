const { writeTemplate } = require('../utils/patcher');
const fs = require('fs-extra');
const path = require('path');

const name = 'Folder Structure';

async function apply(projectPath, ora) {
  try {
    console.log('📁 Creating folder structure...');
    
    // Create main directories
    const directories = [
      'src/components/ui',
      'src/screens', 
      'src/hooks',
      'src/utils',
      'src/constants',
      'src/types',
    ];

    for (const dir of directories) {
      await fs.ensureDir(path.join(projectPath, dir));
    }

    // ============ UI Components ============
    
    // Button component
    const buttonComponent = `import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  const baseClasses = 'py-3 px-6 rounded-lg items-center justify-center';
  const variantClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    outline: 'border-2 border-blue-500 bg-transparent',
  };
  const textClasses = {
    primary: 'text-white font-semibold text-base',
    secondary: 'text-white font-semibold text-base',
    outline: 'text-blue-500 font-semibold text-base',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={\`\${baseClasses} \${variantClasses[variant]} \${disabled ? 'opacity-50' : ''}\`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#3B82F6' : '#fff'} />
      ) : (
        <Text className={textClasses[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
`;
    await writeTemplate(projectPath, 'src/components/ui/Button.tsx', buttonComponent);

    // Input component
    const inputComponent = `import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      )}
      <TextInput
        className={\`border rounded-lg px-4 py-3 text-base \${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white\`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};
`;
    await writeTemplate(projectPath, 'src/components/ui/Input.tsx', inputComponent);

    // Card component
    const cardComponent = `import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <View className={\`bg-white rounded-xl p-4 shadow-sm \${className}\`}>
      {children}
    </View>
  );
};
`;
    await writeTemplate(projectPath, 'src/components/ui/Card.tsx', cardComponent);

    // UI components index
    const uiIndex = `export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
`;
    await writeTemplate(projectPath, 'src/components/ui/index.ts', uiIndex);

    // ============ Screen Components ============

    // Login screen
    const loginScreen = `import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input, Card } from '../components/ui';
import useAppStore from '../store/useAppStore';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { isLoading, setLoading, setUser } = useAppStore();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Replace with your actual login API call
      // const response = await authService.login({ email, password });
      // setUser(response.data.user);
      
      // Simulated login
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ id: '1', name: 'User', email });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-100"
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </Text>
        
        <Card>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          
          <Button
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
          />
          
          <Text className="text-center text-gray-500 mt-4">
            Don't have an account?{' '}
            <Text className="text-blue-500 font-semibold">Sign Up</Text>
          </Text>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};
`;
    await writeTemplate(projectPath, 'src/screens/LoginScreen.tsx', loginScreen);

    // Signup screen
    const signupScreen = `import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Card } from '../components/ui';
import useAppStore from '../store/useAppStore';

export const SignupScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { isLoading, setLoading, setUser } = useAppStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name) newErrors.name = 'Name is required';
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Replace with your actual signup API call
      // const response = await authService.signup({ name, email, password });
      // setUser(response.data.user);
      
      // Simulated signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ id: '1', name, email });
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-100"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="px-6"
      >
        <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Account
        </Text>
        
        <Card>
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          
          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />
          
          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={isLoading}
          />
          
          <Text className="text-center text-gray-500 mt-4">
            Already have an account?{' '}
            <Text className="text-blue-500 font-semibold">Login</Text>
          </Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
`;
    await writeTemplate(projectPath, 'src/screens/SignupScreen.tsx', signupScreen);

    // Home screen with Zustand example
    const homeScreen = `import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Card } from '../components/ui';
import useAppStore from '../store/useAppStore';

export const HomeScreen: React.FC = () => {
  const { user, logout } = useAppStore();

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {user?.name || 'Guest'}!
      </Text>
      
      <Card className="mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Your Profile
        </Text>
        <Text className="text-gray-600">Email: {user?.email}</Text>
        <Text className="text-gray-600">ID: {user?.id}</Text>
      </Card>
      
      <Card className="mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Zustand State Example
        </Text>
        <Text className="text-gray-600 mb-2">
          This screen uses Zustand for state management.
          The user data above is stored in the global store.
        </Text>
      </Card>
      
      <Button
        title="Logout"
        onPress={logout}
        variant="outline"
      />
    </View>
  );
};
`;
    await writeTemplate(projectPath, 'src/screens/HomeScreen.tsx', homeScreen);

    // Screens index
    const screensIndex = `export { LoginScreen } from './LoginScreen';
export { SignupScreen } from './SignupScreen';
export { HomeScreen } from './HomeScreen';
`;
    await writeTemplate(projectPath, 'src/screens/index.ts', screensIndex);

    // ============ Hooks ============
    
    const useExampleHook = `import { useState, useCallback } from 'react';

/**
 * A simple toggle hook
 */
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState<boolean>(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
};
`;
    await writeTemplate(projectPath, 'src/hooks/useToggle.ts', useExampleHook);

    // ============ Utils ============
    
    const utilsContent = `/**
 * Utility functions
 */

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString();
};

export const truncate = (str: string, length: number = 50): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const validateEmail = (email: string): boolean => {
  return /\\S+@\\S+\\.\\S+/.test(email);
};
`;
    await writeTemplate(projectPath, 'src/utils/helpers.ts', utilsContent);

    // ============ Constants ============
    
    const constantsContent = `/**
 * App constants
 */

export const COLORS = {
  primary: '#3B82F6',
  secondary: '#6366F1',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F3F4F6',
  white: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#D1D5DB',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;

export type ColorKey = keyof typeof COLORS;
export type SpacingKey = keyof typeof SPACING;
export type FontSizeKey = keyof typeof FONT_SIZES;
`;
    await writeTemplate(projectPath, 'src/constants/theme.ts', constantsContent);

    // ============ Types ============
    
    const typesContent = `/**
 * Common type definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
}
`;
    await writeTemplate(projectPath, 'src/types/index.ts', typesContent);

    console.log('✔ Folder structure created');
  } catch (error) {
    console.log('✖ Failed to create folder structure');
    throw error;
  }
}

module.exports = { name, apply };
