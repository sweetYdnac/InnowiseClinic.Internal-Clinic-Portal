import { Box, TableRow } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledOfficeRow = withStyles(TableRow, (theme) => ({
    root: {
        '&:last-child td, &:last-child th': { border: 0 },
        cursor: 'pointer',
    },
}));

export const NoOfficesContainer = withStyles(Box, (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing(2),
    },
}));
