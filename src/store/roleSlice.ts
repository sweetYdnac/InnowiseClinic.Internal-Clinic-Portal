import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Roles } from '../types/enums/Roles';
import { RootState } from './store';

const initialState = Roles.None;

export const authorizationSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<Roles>) => action.payload,
    },
});

export const { setRole } = authorizationSlice.actions;
export const selectRole = (state: RootState) => state.role;
export default authorizationSlice.reducer;
