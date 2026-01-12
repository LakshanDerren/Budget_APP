import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export interface Transaction {
    _id?: string;
    amount: number;
    type: 'expense' | 'deposit';
    category: string;
    date: string;
    wallet: 'pocket' | 'vault';
    note?: string;
}

export interface QuickTapItem {
    _id?: string;
    name: string;
    amount: number;
    icon: keyof typeof Ionicons.glyphMap | string;
}

interface WalletState {
    pocketBalance: number;
    vaultBalance: number;
    dailyLimit: number;
    spentToday: number;
    transactions: Transaction[];
    quickAddItems: QuickTapItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: WalletState = {
    pocketBalance: 0,
    vaultBalance: 0,
    dailyLimit: 2000,
    spentToday: 0,
    transactions: [],
    quickAddItems: [],
    status: 'idle',
    error: null,
};

// Async Thunks
export const fetchWallet = createAsyncThunk('wallet/fetchWallet', async (userId: string) => {
    // userId is ignored, used from token
    const response = await api.get('/api/wallet');
    return response.data;
});

export const addTransactionAsync = createAsyncThunk('wallet/addTransaction', async (data: {
    amount: number;
    type: 'expense' | 'deposit';
    category: string;
    wallet: 'pocket' | 'vault';
    note?: string;
}) => {
    const response = await api.post('/api/wallet/transaction', data);
    return response.data; // Returns the transaction object, but we might want to refetch wallet to be safe or just push to list
});

export const setDailyLimitAsync = createAsyncThunk('wallet/setDailyLimit', async (data: { limit: number }) => {
    const response = await api.put('/api/wallet/limit', data);
    return response.data;
});

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        resetWallet: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Wallet
            .addCase(fetchWallet.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWallet.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pocketBalance = action.payload.pocketBalance;
                state.vaultBalance = action.payload.vaultBalance;
                state.dailyLimit = action.payload.dailyLimit;
                state.spentToday = action.payload.spentToday;
                state.quickAddItems = action.payload.quickAddItems;
                state.transactions = action.payload.transactions;
            })
            .addCase(fetchWallet.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Fetch failed';
            })
            // Add Transaction
            .addCase(addTransactionAsync.fulfilled, (state, action) => {
                const { amount, type, wallet, category } = action.meta.arg;
                // Optimistically update or use payload if it contains updated user data?
                // The backend currently returns the *transaction*.
                // We should manually update state to reflect instant change.

                if (type === 'deposit') {
                    if (wallet === 'pocket') state.pocketBalance += amount;
                    else state.vaultBalance += amount;
                } else if (type === 'expense') {
                    if (wallet === 'pocket') {
                        state.pocketBalance -= amount;
                        state.spentToday += amount;
                    } else {
                        state.vaultBalance -= amount;
                    }

                    // Update Quick Add Items logic locally to match backend
                    const existingIndex = state.quickAddItems.findIndex(item => item.name.toLowerCase() === category.toLowerCase());
                    if (existingIndex !== -1) {
                        state.quickAddItems[existingIndex].amount = amount;
                    } else {
                        state.quickAddItems.push({
                            name: category,
                            amount,
                            icon: 'pricetag',
                        });
                    }
                }

                state.transactions.unshift(action.payload);
            })
            // Set Daily Limit
            .addCase(setDailyLimitAsync.fulfilled, (state, action) => {
                state.dailyLimit = action.payload.dailyLimit;
            });
    },
});

export const { resetWallet } = walletSlice.actions;

export const selectQuickAddItems = (state: { wallet: WalletState }) => {
    return state.wallet.quickAddItems || [];
};

export default walletSlice.reducer;
