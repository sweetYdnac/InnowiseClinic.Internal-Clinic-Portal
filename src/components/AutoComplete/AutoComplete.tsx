import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { useController } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { AutoCompleteProps } from './AutoComplete.interface';

export const AutoComplete: FunctionComponent<AutoCompleteProps> = ({
    valueFieldName,
    control,
    displayName,
    options,
    isFetching,
    handleOpen,
    handleInputChange,
    disabled = false,
    readonly = false,
    inputFieldName,
    debounceDelay = 0,
}) => {
    const [open, setOpen] = useState(false);
    const debounced = useDebouncedCallback(() => handleInputChange?.(), debounceDelay);

    const { field: idField, fieldState: idFieldState } = useController({
        name: valueFieldName,
        control: control,
    });

    const { field: inputField } = useController({
        name: inputFieldName ?? '',
        control: control,
    });

    return (
        <Autocomplete
            clearOnBlur={true}
            {...idField}
            disabled={disabled}
            readOnly={readonly}
            loading={isFetching || debounced.isPending()}
            open={open}
            onOpen={() => {
                setOpen(true);
                handleOpen();
            }}
            onClose={() => setOpen(false)}
            defaultValue={options.find((option) => option.id === idField.value) || null}
            value={options.find((option) => option.id === idField.value) || null}
            onChange={(_e, value) => {
                idField.onChange(value?.id || '');
            }}
            onInputChange={(_, value, reason) => {
                if (reason === 'input') {
                    inputField.onChange(value);
                    debounced?.();
                } else if ((reason = 'clear')) {
                    inputField.onChange(value);
                }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option: IAutoCompleteItem) => option.label}
            options={options}
            autoHighlight
            sx={{ m: 1, width: '75%' }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={idFieldState.error?.message && idFieldState.isTouched ? 'Error' : displayName}
                    variant='standard'
                    color={idFieldState.error?.message && (idFieldState.isTouched || idField.value) ? 'error' : 'success'}
                    focused={!readonly && !idFieldState.error?.message && (idFieldState.isTouched || !!idField.value)}
                    error={!!idFieldState.error?.message && (idFieldState.isTouched || !!idField.value)}
                    helperText={idFieldState.error?.message && (idFieldState.isTouched || idField.value) ? idFieldState.error?.message : ''}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isFetching || debounced.isPending() ? <CircularProgress color='inherit' size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};
