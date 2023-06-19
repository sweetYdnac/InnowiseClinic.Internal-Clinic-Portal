import { TableRow } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledPatientHistoryRow = withStyles(TableRow, {
    root: {
        '&:last-child td, &:last-child th': { border: 0 },
    },
});
