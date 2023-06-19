import { Box } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledContent = withStyles(Box, {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
});

export const StyledBody = withStyles(Box, {
    root: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
    },
});

export const StyledOutlet = withStyles(Box, (theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));
