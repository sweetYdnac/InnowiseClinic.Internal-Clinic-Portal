import { Box } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const ModalHeader = withStyles(Box, {
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
