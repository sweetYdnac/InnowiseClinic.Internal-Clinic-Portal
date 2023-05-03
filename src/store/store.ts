import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';
import profileReducer from './profileSlice';

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        role: roleReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
