const { installDeps } = require('../utils/installer');
const { writeTemplate, patchJSON } = require('../utils/patcher');
const fs = require('fs-extra');
const path = require('path');

const name = 'Navigation (Expo Router)';

async function apply(projectPath, ora) {
  try {
    console.log('📦 Installing Expo Router...');
    await installDeps(projectPath, [
      'expo-router',
      'expo-linking',
      'expo-constants',
      'react-native-screens'
    ]);

    // Create app directory for file-based routing
    console.log('📝 Creating Expo Router structure...');
    await fs.ensureDir(path.join(projectPath, 'app'));

    // Create _layout.tsx (Root Layout)
    const rootLayout = `import "../global.css";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}
`;
    await writeTemplate(projectPath, 'app/_layout.tsx', rootLayout);

    // Create index.tsx (Start/Welcome screen)
    const indexScreen = `import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function StartScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-4xl font-bold text-gray-800 mb-4">
        Welcome
      </Text>
      <Text className="text-gray-500 text-center mb-8">
        Get started with your app
      </Text>
      
      <TouchableOpacity
        onPress={() => router.push("/login")}
        className="bg-blue-500 py-4 px-8 rounded-lg w-full mb-4"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Login
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => router.push("/signup")}
        className="border-2 border-blue-500 py-4 px-8 rounded-lg w-full"
      >
        <Text className="text-blue-500 text-center font-semibold text-lg">
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
`;
    await writeTemplate(projectPath, 'app/index.tsx', indexScreen);

    // Create login.tsx
    const loginScreen = `import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import useAppStore from "../src/store/useAppStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { isLoading, setLoading, setUser } = useAppStore();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\\S+@\\S+\\.\\S+/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Min 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Simulated login - replace with your API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ id: "1", name: "User", email });
      router.replace("/home");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome Back
        </Text>

        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text className="text-gray-700 font-medium mb-2">Email</Text>
          <TextInput
            className={\`border rounded-lg px-4 py-3 mb-1 \${errors.email ? "border-red-500" : "border-gray-300"}\`}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>}

          <Text className="text-gray-700 font-medium mb-2 mt-2">Password</Text>
          <TextInput
            className={\`border rounded-lg px-4 py-3 mb-1 \${errors.password ? "border-red-500" : "border-gray-300"}\`}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && <Text className="text-red-500 text-sm mb-3">{errors.password}</Text>}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={\`bg-blue-500 py-4 rounded-lg mt-4 \${isLoading ? "opacity-50" : ""}\`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? "Loading..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup")} className="mt-4">
            <Text className="text-center text-gray-500">
              Don't have an account?{" "}
              <Text className="text-blue-500 font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
`;
    await writeTemplate(projectPath, 'app/login.tsx', loginScreen);

    // Create signup.tsx
    const signupScreen = `import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import useAppStore from "../src/store/useAppStore";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { isLoading, setLoading, setUser } = useAppStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\\S+@\\S+\\.\\S+/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Min 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Simulated signup - replace with your API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ id: "1", name, email });
      router.replace("/home");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} className="px-6">
        <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Account
        </Text>

        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
          <TextInput
            className={\`border rounded-lg px-4 py-3 mb-1 \${errors.name ? "border-red-500" : "border-gray-300"}\`}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text className="text-red-500 text-sm mb-3">{errors.name}</Text>}

          <Text className="text-gray-700 font-medium mb-2 mt-2">Email</Text>
          <TextInput
            className={\`border rounded-lg px-4 py-3 mb-1 \${errors.email ? "border-red-500" : "border-gray-300"}\`}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>}

          <Text className="text-gray-700 font-medium mb-2 mt-2">Password</Text>
          <TextInput
            className={\`border rounded-lg px-4 py-3 mb-1 \${errors.password ? "border-red-500" : "border-gray-300"}\`}
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && <Text className="text-red-500 text-sm mb-3">{errors.password}</Text>}

          <TouchableOpacity
            onPress={handleSignup}
            disabled={isLoading}
            className={\`bg-blue-500 py-4 rounded-lg mt-4 \${isLoading ? "opacity-50" : ""}\`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? "Loading..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")} className="mt-4">
            <Text className="text-center text-gray-500">
              Already have an account?{" "}
              <Text className="text-blue-500 font-semibold">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
`;
    await writeTemplate(projectPath, 'app/signup.tsx', signupScreen);

    // Create home.tsx
    const homeScreen = `import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import useAppStore from "../src/store/useAppStore";

export default function HomeScreen() {
  const { user, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-gray-100 p-6 pt-16">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {user?.name || "Guest"}!
      </Text>

      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Your Profile</Text>
        <Text className="text-gray-600">Email: {user?.email}</Text>
        <Text className="text-gray-600">ID: {user?.id}</Text>
      </View>

      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Zustand State</Text>
        <Text className="text-gray-600">
          This screen uses Zustand for global state management.
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="border-2 border-blue-500 py-4 rounded-lg"
      >
        <Text className="text-blue-500 text-center font-semibold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
`;
    await writeTemplate(projectPath, 'app/home.tsx', homeScreen);

    // Update app.json with expo-router scheme
    const appJsonPath = path.join(projectPath, 'app.json');
    if (await fs.pathExists(appJsonPath)) {
      const appJson = await fs.readJSON(appJsonPath);
      appJson.expo.scheme = appJson.expo.slug || 'myapp';
      await fs.writeJSON(appJsonPath, appJson, { spaces: 2 });
    }

    // Update package.json main entry point for expo-router
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJSON(packageJsonPath);
      packageJson.main = 'expo-router/entry';
      await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    }

    // Delete old App.tsx since expo-router uses app/ directory
    const appTsxPath = path.join(projectPath, 'App.tsx');
    if (await fs.pathExists(appTsxPath)) {
      await fs.remove(appTsxPath);
    }

    console.log('✔ Expo Router configured');
  } catch (error) {
    console.log('✖ Failed to configure navigation');
    throw error;
  }
}

module.exports = { name, apply };
