import { TableRow } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const AddServiceRow = withStyles(TableRow, {
    root: {
        '&:last-child td, &:last-child th': { border: 0 },
        cursor: 'pointer',
    },
});

export const StyledNewServiceRow = withStyles(TableRow, {
    root: {
        backgroundColor: 'lightgreen',
    },
});

export const StyledExistingServiceRow = withStyles(TableRow, {
    root: {
        '&:last-child td, &:last-child th': { border: 0 },
        cursor: 'pointer',
        backgroundColor: 'lightgreen',
    },
});
