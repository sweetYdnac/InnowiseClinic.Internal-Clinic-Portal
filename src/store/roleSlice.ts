import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Roles } from '../types/enums/Roles';
import { RootState } from './store';

export const defaultRole = Roles.None;

export const roleSlice = createSlice({
    name: 'profile',
    initialState: defaultRole,
    reducers: {
        setRole: (state, action: PayloadAction<Roles>) => action.payload,
    },
});

export const { setRole } = roleSlice.actions;
export const selectRole = (state: RootState) => state.role;
export default roleSlice.reducer;
