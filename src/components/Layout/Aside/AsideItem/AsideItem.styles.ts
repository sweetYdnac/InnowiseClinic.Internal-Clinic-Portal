import { ListItemButton } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const NavigationButton = withStyles(ListItemButton, {
    root: {
        margin: '10px 0px',
    },
});
