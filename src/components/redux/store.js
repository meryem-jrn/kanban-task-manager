import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import tasksReducer from './tasksSlice';
import themeReducer from './themeSlice';

const store = configureStore({
    reducer: {
        users: usersReducer,
        tasks: tasksReducer,
        theme: themeReducer,
    },
});

export default store;