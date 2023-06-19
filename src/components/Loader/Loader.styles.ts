import { Backdrop, CircularProgress } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledBackdrop = withStyles(Backdrop, (theme) => ({
    root: {
        color: '#fff',
        zIndex: theme.zIndex.drawer + 1,
    },
}));

export const StyledLoader = withStyles(CircularProgress, () => ({
    root: {
        color: 'inherit',
    },
}));
