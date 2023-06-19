import { Box } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledForm = withStyles(Box, {
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
});

export const StyledOperationsButtons = withStyles(Box, {
    root: {
        width: '75%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});
