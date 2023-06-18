import { Table } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledTable = withStyles(Table, {
    root: {
        minWidth: '650',
    },
});
