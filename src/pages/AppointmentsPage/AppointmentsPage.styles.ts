import { Box } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledForm = withStyles(Box, {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
});

export const FiltersBody = withStyles(Box, {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
});
