import axios from 'axios';
import { Platform } from 'react-native';
import storage from '../store/storage';

// Use 10.0.2.2 for Android Emulator, localhost for iOS/Web
// For physical device, replace with your local IP address (e.g., http://192.168.1.5:5000)
const DEV_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || DEV_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await storage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
