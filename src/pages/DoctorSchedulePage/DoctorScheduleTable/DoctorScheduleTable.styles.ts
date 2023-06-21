import { Box, TableRow } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledDoctorRow = withStyles(TableRow, {
    root: {
        '&:last-child td, &:last-child th': { border: 0 },
    },
});

export const NoDoctorsContainer = withStyles(Box, (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
        alignItems: 'center',
    },
}));
