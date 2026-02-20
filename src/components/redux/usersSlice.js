import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/users';

export const loadUsers = createAsyncThunk('users/loadUsers', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (userData) => {
    const response = await axios.post(API_URL, userData);
    return response.data;
});

export const removeUser = createAsyncThunk('users/removeUser', async (userId) => {
    await axios.delete(`${API_URL}/${userId}`);
    return userId;
});

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(loadUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.items = [...state.items, action.payload];
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.items = state.items.filter((u) => u.id !== action.payload);
            });
    },
});

export default usersSlice.reducer;
