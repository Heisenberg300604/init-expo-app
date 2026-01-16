# Create Expo Starter

CLI to scaffold Expo React Native apps with opinionated defaults.

## Quick Start

```bash
npx create-expo-starter my-app
cd my-app
npx expo start
```

## Features

- ✅ **TypeScript** - Full TypeScript support
- ✅ **Expo Router** - File-based navigation
- ✅ **NativeWind** - Tailwind CSS for React Native
- ✅ **Zustand** - Lightweight state management
- ✅ **Axios** - API client with interceptors
- ✅ **Starter Screens** - Login, Signup, Home

## Generated Structure

```
my-app/
├── app/                    # Expo Router (file-based routing)
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Welcome screen
│   ├── login.tsx           # Login screen
│   ├── signup.tsx          # Signup screen
│   └── home.tsx            # Home screen
├── src/
│   ├── components/ui/      # Button, Input, Card
│   ├── store/              # Zustand store
│   ├── api/                # Axios client
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Helper functions
│   ├── constants/          # Theme constants
│   └── types/              # TypeScript types
├── global.css              # Tailwind styles
├── tailwind.config.js
└── metro.config.js
```

## Options

During setup, you can choose:
- **NativeWind** (Tailwind CSS) - default: yes
- **Zustand** (state management) - default: yes
- **Axios** (API client) - default: yes
- **Environment config** - default: yes

