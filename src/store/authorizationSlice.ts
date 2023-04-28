import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Roles } from '../types/enums/Roles';
import { RootState } from './store';

export interface IAuthorizationState {
    accessToken: string;
    refreshToken: string;
    role: Roles;
    expirationTime: number;
}

const initialState: IAuthorizationState = {
    accessToken: '',
    refreshToken: '',
    role: Roles.None,
    expirationTime: 0,
};

export const authorizationSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setAuthorization: (state, action: PayloadAction<IAuthorizationState>) => action.payload,
    },
});

export const { setAuthorization } = authorizationSlice.actions;
export const selectAuth = (state: RootState) => state.authorization;
export default authorizationSlice.reducer;
