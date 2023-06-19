import { TableRow } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledReceptionistRow = withStyles(TableRow, {
    root: {
        '&:last-child td, &:last-child th': { border: 0 },
        cursor: 'pointer',
    },
});

export const NoReceptionistContainer = withStyles(TableRow, (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing(2),
    },
}));
