import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export const defaultLayoutState = {
    isAsideOpened: false,
};

export const layoutSlice = createSlice({
    name: 'layout',
    initialState: defaultLayoutState,
    reducers: {
        switchAside: (state) => {
            state.isAsideOpened = !state.isAsideOpened;
        },
    },
});

export const { switchAside } = layoutSlice.actions;
export const selectAside = (state: RootState) => state.layout.isAsideOpened;
export default layoutSlice.reducer;
