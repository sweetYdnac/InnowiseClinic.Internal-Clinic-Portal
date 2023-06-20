import { InputAdornment, TextField } from '@mui/material';
import { FunctionComponent } from 'react';
import { useStyles } from '../styles';
import { ReadonlyTextfieldProps } from './Readonlytextfield.interface';

export const ReadonlyTextfield: FunctionComponent<ReadonlyTextfieldProps> = ({
    displayName,
    value,
    inputMode = 'text',
    startAdornment,
    endAdornment,
}) => {
    const { classes } = useStyles();

    return (
        <TextField
            className={classes.textField}
            value={value}
            label={displayName}
            variant='standard'
            InputProps={{
                readOnly: true,
                inputMode: inputMode,
                startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
                endAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
            }}
        />
    );
};
