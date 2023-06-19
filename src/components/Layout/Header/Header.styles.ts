import { AppBar, Button, IconButton } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledAppBar = withStyles(AppBar, {
    root: {
        position: 'inherit',
    },
});

export const AsideButton = withStyles(IconButton, (theme) => ({
    root: {
        color: 'inherit',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
}));

export const HomeButton = withStyles(Button, {
    root: {
        color: 'inherit',
    },
});

export const LoginButton = withStyles(Button, {
    root: {
        marginLeft: 'auto',
        color: 'inherit',
    },
});
