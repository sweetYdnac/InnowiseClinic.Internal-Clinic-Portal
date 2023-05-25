import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface IProfileState {
    id: string;
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName: string;
    officeId: string;
    officeAddress: string;
    dateOfBirth: string;
    specializationId: string;
    specializationName: string;
    careerStartYear: number;
    status: number;
}

export const defaultProfile: IProfileState = {
    id: '',
    photoId: null,
    firstName: '',
    lastName: '',
    middleName: '',
    officeId: '',
    officeAddress: '',
    dateOfBirth: '',
    specializationId: '',
    specializationName: '',
    careerStartYear: 2000,
    status: 1,
};

export const userSlice = createSlice({
    name: 'profile',
    initialState: defaultProfile,
    reducers: {
        setProfile: (state, action: PayloadAction<IProfileState>) => action.payload,
    },
});

export const { setProfile } = userSlice.actions;
export const selectProfile = (state: RootState) => state.profile;
export default userSlice.reducer;
