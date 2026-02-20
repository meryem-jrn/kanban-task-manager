import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/tasks';

export const loadTasks = createAsyncThunk('tasks/loadTasks', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const loadTaskById = createAsyncThunk('tasks/loadTaskById', async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
});

export const addTask = createAsyncThunk('tasks/addTask', async (taskData) => {
    const response = await axios.post(API_URL, taskData);
    return response.data;
});

export const modifyTask = createAsyncThunk('tasks/modifyTask', async ({ id, ...taskData }) => {
    const response = await axios.put(`${API_URL}/${id}`, { id: String(id), ...taskData });
    return response.data;
});  


export const removeTask = createAsyncThunk('tasks/removeTask', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return String(id);
});

export const updateTaskStatus = createAsyncThunk(
    'tasks/updateTaskStatus',
    async ({ id, status }) => {
        const getRes = await axios.get(`${API_URL}/${id}`);
        const updated = { ...getRes.data, status };
        const response = await axios.put(`${API_URL}/${id}`, updated);
        return response.data;
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        currentTask: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(loadTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(loadTaskById.fulfilled, (state, action) => {
                state.currentTask = action.payload;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.items = [...state.items, action.payload];
            })
            .addCase(modifyTask.fulfilled, (state, action) => {
                state.items = state.items.map((t) =>
                    String(t.id) === String(action.payload.id) ? action.payload : t
                );
                state.currentTask = action.payload;
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                state.items = state.items.filter((t) => String(t.id) !== String(action.payload));
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                state.items = state.items.map((t) =>
                    String(t.id) === String(action.payload.id) ? action.payload : t
                );
            });
    },
});

export default tasksSlice.reducer;
