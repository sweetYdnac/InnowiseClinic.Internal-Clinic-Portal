import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './layoutSlice';
import profileReducer from './profileSlice';
import roleReducer from './roleSlice';

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        role: roleReducer,
        layout: layoutReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
