import axios from 'axios';
import { Platform } from 'react-native';
import storage from '../store/storage';

// Production EC2 URL
const DEV_URL = 'http://51.21.222.39:5000';

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
