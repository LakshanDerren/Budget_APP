import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Helper to check if we are in a valid environment for AsyncStorage
const isClient = Platform.OS !== 'web' || typeof window !== 'undefined';

const storage = {
    getItem: async (key: string): Promise<string | null> => {
        if (!isClient) return null;
        return AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string): Promise<void> => {
        if (!isClient) return;
        return AsyncStorage.setItem(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
        if (!isClient) return;
        return AsyncStorage.removeItem(key);
    },
};

export default storage;
