import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import storage from '../storage';

interface UserData {
    _id?: string;
    name: string;
    email: string;
    currency: string;
    isOnboarded: boolean;
    token?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: UserData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    status: 'idle',
    error: null,
};

// Async Thunks
export const registerUser = createAsyncThunk('auth/register', async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
        await storage.setItem('userToken', response.data.token);
    }
    return response.data;
});

export const loginUser = createAsyncThunk('auth/login', async (userData: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', userData);
    if (response.data.token) {
        await storage.setItem('userToken', response.data.token);
    }
    return response.data;
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data: Partial<UserData>) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            storage.removeItem('userToken').catch(err => console.error("Error removing token", err));
            state.isAuthenticated = false;
            state.user = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Registration failed';
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Login failed';
            })
            // Update Profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload };
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

