import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Modals } from '../constants/Modals';
import { WorkMode } from '../constants/WorkModes';
import { RootState } from './store';

export interface IModalState {
    name: Modals;
    id?: string;
    workMode?: WorkMode;
}

export const defaultState: IModalState = {
    name: Modals.None,
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState: defaultState,
    reducers: {
        openModal: (state, action: PayloadAction<IModalState>) => action.payload,
        closeModal: () => defaultState,
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export const selectModal = (state: RootState) => state.modal;
export default modalSlice.reducer;
