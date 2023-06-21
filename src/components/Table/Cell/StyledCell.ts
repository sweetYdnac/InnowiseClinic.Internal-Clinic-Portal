import { TableCell } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledCell = withStyles(TableCell, {
    root: {
        textAlign: 'center',
    },
});
