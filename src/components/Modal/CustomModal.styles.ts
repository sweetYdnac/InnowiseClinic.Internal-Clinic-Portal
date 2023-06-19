import { Box } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledModal = withStyles(Box, {
    root: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 26px 1px rgba(12, 15, 17, 0.66)',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
    },
});
