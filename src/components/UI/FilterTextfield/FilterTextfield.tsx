import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FunctionComponent, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { useStyles } from '../styles';
import { FilterTextfieldProps } from './FilterTextfield.interface';

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
    const { classes } = useStyles();

    const { field: valueField, fieldState: valueFieldState } = useController({
        name: valueFieldName,
        control: control,
    });

    const { field: inputField } = useController({
        name: inputFieldName ?? '',
        control: control,
    });

    const debounced = useDebouncedCallback((value: string) => valueField.onChange(value), debounceDelay);

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            inputField.onChange(e.target.value);
            debounced(e.target.value);
        },
        [debounced, inputField]
    );

    return (
        <TextField
            {...valueField}
            className={classes.textField}
            variant='standard'
            color={valueFieldState.error?.message && (valueFieldState.isTouched || valueField.value) ? 'error' : 'success'}
            focused={!valueFieldState.error?.message && (valueFieldState.isTouched || !!valueField.value)}
            label={valueFieldState.error?.message && valueFieldState.isTouched ? 'Error' : displayName}
            error={!!valueFieldState.error?.message && (valueFieldState.isTouched || !!valueField.value)}
            helperText={valueFieldState.error?.message}
            value={inputField.value}
            onChange={onChange}
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
