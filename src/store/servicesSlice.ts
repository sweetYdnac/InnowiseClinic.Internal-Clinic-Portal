import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { deepEqual } from 'fast-equals';
import { IServiceForm } from '../hooks/validators/services/create&update';
import { RootState } from './store';

export const defaultState: IServiceForm[] = [];

export const servicesSlice = createSlice({
    name: 'services',
    initialState: defaultState,
    reducers: {
        addService: (state, action: PayloadAction<IServiceForm>) => {
            state.push(action.payload);
        },
        removeService: (state, action: PayloadAction<IServiceForm>) => state.filter((service) => !deepEqual(service, action.payload)),
        clearServices: () => defaultState,
    },
});

export const { addService, removeService, clearServices } = servicesSlice.actions;
export const selectServices = (state: RootState) => state.services;
export default servicesSlice.reducer;
