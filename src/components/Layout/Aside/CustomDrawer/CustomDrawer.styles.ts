import { Drawer } from '@mui/material';
import { CSSProperties } from 'react';
import { withStyles } from 'tss-react/mui';

const width = 250;

export const PermanentDrawer = withStyles(Drawer, (theme) => ({
    root: {
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    paper: {
        width: width,
        boxSizing: 'border-box' as CSSProperties['boxSizing'],
        position: 'inherit' as CSSProperties['position'],
    },
}));

export const TemporaryDrawer = withStyles(Drawer, (theme) => ({
    root: {
        height: '100%',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'block',
        },
    },
    paper: {
        width: width,
        boxSizing: 'border-box' as CSSProperties['boxSizing'],
    },
}));
