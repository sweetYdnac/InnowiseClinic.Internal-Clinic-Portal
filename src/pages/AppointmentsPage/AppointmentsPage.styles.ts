import { Box } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const FiltersBody = withStyles(Box, {
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
});
