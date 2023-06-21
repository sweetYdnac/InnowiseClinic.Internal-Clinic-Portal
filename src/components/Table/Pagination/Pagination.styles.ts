import { TablePagination } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledPagination = withStyles(TablePagination, {
    root: {
        alignSelf: 'end',
    },
});
