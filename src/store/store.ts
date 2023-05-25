import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './layoutSlice';
import modalReducer from './modalsSlice';
import profileReducer from './profileSlice';
import roleReducer from './roleSlice';
import servicesReducer from './servicesSlice';

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        role: roleReducer,
        layout: layoutReducer,
        modal: modalReducer,
        services: servicesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
