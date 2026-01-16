const { installDeps } = require('../utils/installer');
const { writeTemplate } = require('../utils/patcher');

const name = 'Zustand';

async function apply(projectPath, ora) {
  try {
    console.log('📦 Installing Zustand...');
    await installDeps(projectPath, ['zustand']);

    // Create store directory and example store (TypeScript)
    console.log('📝 Creating store template...');
    const storeContent = `import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  isLoading: boolean;
  user: User | null;
  setLoading: (isLoading: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchUser: (userId: string) => Promise<void>;
}

/**
 * App-wide state store using Zustand
 * Add your global state and actions here
 */
const useAppStore = create<AppState>((set) => ({
  // State
  isLoading: false,
  user: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  
  setUser: (user) => set({ user }),
  
  logout: () => set({ user: null }),

  // Async action example
  fetchUser: async (userId) => {
    set({ isLoading: true });
    try {
      // Replace with your API call
      // const user = await api.getUser(userId);
      // set({ user, isLoading: false });
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

export default useAppStore;
`;
    await writeTemplate(projectPath, 'src/store/useAppStore.ts', storeContent);

    console.log('✔ Zustand configured');
  } catch (error) {
    console.log('✖ Failed to configure Zustand');
    throw error;
  }
}

module.exports = { name, apply };
