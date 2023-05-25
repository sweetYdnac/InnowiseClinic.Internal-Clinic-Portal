import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FunctionComponent, ReactNode } from 'react';
import { Control, useController } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';

interface FilterTextfieldProps {
    valueFieldName: string;
    inputFieldName: string;
    control: Control<any, any>;
    displayName: string;
    debounceDelay?: number;
    inputMode?: 'text' | 'numeric';
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

export const FilterTextfield: FunctionComponent<FilterTextfieldProps> = ({
    valueFieldName,
    inputFieldName,
    control,
    displayName,
    inputMode = 'text',
    debounceDelay = 0,
    startAdornment,
    endAdornment,
}: FilterTextfieldProps) => {
    const { field: valueField, fieldState: valueFieldState } = useController({
        name: valueFieldName,
        control: control,
    });

    const { field: inputField } = useController({
        name: inputFieldName ?? '',
        control: control,
    });

    const debounced = useDebouncedCallback((value: string) => valueField.onChange(value), debounceDelay);

    return (
        <TextField
            {...valueField}
            sx={{ m: 1, width: '75%' }}
            variant='standard'
            color={valueFieldState.error?.message && (valueFieldState.isTouched || valueField.value) ? 'error' : 'success'}
            focused={!valueFieldState.error?.message && (valueFieldState.isTouched || !!valueField.value)}
            label={valueFieldState.error?.message && valueFieldState.isTouched ? 'Error' : displayName}
            error={!!valueFieldState.error?.message && (valueFieldState.isTouched || !!valueField.value)}
            helperText={valueFieldState.error?.message}
            value={inputField.value}
            onChange={(e) => {
                inputField.onChange(e.target.value);
                debounced(e.target.value);
            }}
            InputProps={{
                inputMode: inputMode,
                startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
                endAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
            }}
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
};
