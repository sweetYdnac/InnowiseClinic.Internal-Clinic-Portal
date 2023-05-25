import { InputAdornment, TextField } from '@mui/material';
import { FunctionComponent, ReactNode } from 'react';

interface ReadonlyTextfieldProps {
    displayName: string;
    value: string | number;
    inputMode?: 'text' | 'numeric';
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

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
