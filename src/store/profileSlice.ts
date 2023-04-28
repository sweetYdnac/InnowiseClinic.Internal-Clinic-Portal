import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface IProfileState {
    id: string;
    photoId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    officeAddress: string;
    dateOfBirth: string;
    specializationName: string;
    careerStartYear: number;
    status: number;
}

const initialState: IProfileState = {
    id: '',
    photoId: '',
    firstName: '',
    lastName: '',
    middleName: '',
    officeAddress: '',
    dateOfBirth: '',
    specializationName: '',
    careerStartYear: 2000,
    status: 1,
};

export const userSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<IProfileState>) => action.payload,
    },
});

export const { setProfile } = userSlice.actions;
export const selectProfile = (state: RootState) => state.profile;
export default userSlice.reducer;
