import { Box } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const Container = withStyles(Box, {
    root: {
        display: 'flex',
        flexDirection: 'row',
    },
});

export const Image = withStyles('img', {
    root: {
        width: '200px',
    },
});
