import { Button } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const StyledSubmitButton = withStyles(Button, (theme) => ({
    root: {
        backgroundColor: theme.palette.success.main,
    },
}));
