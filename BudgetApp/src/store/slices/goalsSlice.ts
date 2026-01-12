import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Goal {
    id: string;
    _id?: string;
    name: string;
    targetAmount: number;
    savedAmount: number;
    priority: number;
    isCompleted: boolean;
    deadline?: string;
}

export interface GoalsState {
    goals: Goal[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: GoalsState = {
    goals: [],
    status: 'idle',
    error: null,
};

// Async Thunks
export const fetchGoals = createAsyncThunk('goals/fetchGoals', async (userId: string) => {
    // userId is ignored, used from token
    const response = await api.get('/api/goals');
    return response.data;
});

export const addGoalAsync = createAsyncThunk('goals/addGoal', async (data: { name: string; targetAmount: number; deadline?: string }) => {
    const response = await api.post('/api/goals', data);
    return response.data;
});

export const updateGoalAsync = createAsyncThunk('goals/updateGoal', async (data: { goalId: string; isCompleted: boolean }) => {
    const response = await api.put(`/api/goals/${data.goalId}`, { isCompleted: data.isCompleted });
    return response.data;
});

export const reorderGoalsAsync = createAsyncThunk('goals/reorderGoals', async (data: { goalId: string; direction: 'up' | 'down' }) => {
    const response = await api.put('/api/goals/reorder', data);
    return response.data; // Returns updated list of goals
});

export const deleteGoalAsync = createAsyncThunk('goals/deleteGoal', async (goalId: string) => {
    await api.delete(`/api/goals/${goalId}`);
    return goalId;
});

const goalsSlice = createSlice({
    name: 'goals',
    initialState,
    reducers: {
        resetGoals: (state) => {
            state.goals = [];
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Goals
            .addCase(fetchGoals.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.goals = action.payload.map((g: any) => ({ ...g, id: g._id }));
            })
            .addCase(fetchGoals.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Fetch failed';
            })
            // Add Goal
            .addCase(addGoalAsync.fulfilled, (state, action) => {
                const goal = action.payload;
                state.goals.push({ ...goal, id: goal._id, savedAmount: 0 });
                // Re-sort implicitly via priority if needed, but usually new goal is last
            })
            // Update Goal
            .addCase(updateGoalAsync.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.goals.findIndex(g => g.id === updated._id);
                if (index !== -1) {
                    state.goals[index] = { ...state.goals[index], ...updated, id: updated._id };
                }
            })
            // Reorder Goals
            .addCase(reorderGoalsAsync.fulfilled, (state, action) => {
                state.goals = action.payload.map((g: any) => ({ ...g, id: g._id }));
            })
            // Delete Goal
            .addCase(deleteGoalAsync.fulfilled, (state, action) => {
                state.goals = state.goals.filter(g => g.id !== action.payload);
            });
    },
});

export const { resetGoals } = goalsSlice.actions;

// Selector to calculate funding usually requires root state.
// We keep the selector logic same but types might need adjustment if used elsewhere.
interface RootStateSubset {
    goals: GoalsState;
    wallet: { vaultBalance: number };
}

const selectGoals = (state: RootStateSubset) => state.goals.goals;
const selectVaultBalance = (state: RootStateSubset) => state.wallet.vaultBalance;

export const selectGoalsWithFunding = createSelector(
    [selectGoals, selectVaultBalance],
    (goals, vaultBalance) => {
        let remainingBalance = vaultBalance;

        // Sort goals by priority
        const sortedGoals = [...goals].sort((a, b) => a.priority - b.priority);

        return sortedGoals.map(goal => {
            if (remainingBalance <= 0) {
                return { ...goal, savedAmount: 0 };
            }

            const needed = goal.targetAmount;
            if (remainingBalance >= needed) {
                remainingBalance -= needed;
                return { ...goal, savedAmount: needed };
            } else {
                const funded = remainingBalance;
                remainingBalance = 0;
                return { ...goal, savedAmount: funded };
            }
        });
    }
);

export default goalsSlice.reducer;
