import { Box } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledSignInForm = withStyles(Box, {
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
});
