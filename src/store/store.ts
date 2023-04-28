import { configureStore } from '@reduxjs/toolkit';
import authorizationReducer from './authorizationSlice';
import profileReducer from './profileSlice';

export const store = configureStore({
    reducer: {
        authorization: authorizationReducer,
        profile: profileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
