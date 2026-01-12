import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './slices/authSlice';
import goalsReducer from './slices/goalsSlice';
import walletReducer from './slices/walletSlice';
import storage from './storage';

import settingsReducer from './slices/settingsSlice';

const rootReducer = combineReducers({
  wallet: walletReducer,
  goals: goalsReducer,
  auth: authReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['wallet', 'goals', 'auth', 'settings'], // Persist all main slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
