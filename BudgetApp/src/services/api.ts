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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            await storage.removeItem('userToken');
            // We need to perform navigation or state update to redirect user
            // Since we are outside React component, we might need a global navigation ref or simple reload
            // For Expo Router, we can try imperative navigation, but it might be unstable outside context.
            // A safer bet is to clear storage and let the user restart, OR use router if available.

            // Note: In a real app, we might dispatch a Redux action to clear auth state.
            // For now, let's clear storage and try to reload/redirect if possible.

            const { router } = require('expo-router');
            if (router) {
                router.replace('/onboarding');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
