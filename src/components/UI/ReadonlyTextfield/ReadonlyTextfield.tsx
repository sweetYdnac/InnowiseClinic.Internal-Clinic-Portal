import { InputAdornment, TextField } from '@mui/material';
import { FunctionComponent } from 'react';
import { ReadonlyTextfieldProps } from './Readonlytextfield.interface';

export const ReadonlyTextfield: FunctionComponent<ReadonlyTextfieldProps> = ({
    displayName,
    value,
    inputMode = 'text',
    startAdornment,
    endAdornment,
}) => {
    return (
        <TextField
            sx={{ m: 1, width: '75%' }}
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
