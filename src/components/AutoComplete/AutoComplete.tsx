import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

interface AutoCompleteProps {
    id: string;
    displayName: string;
    control: Control<any, any>;
    options: IAutoCompleteItem[];
    handleOpen: () => void;
    disabled?: boolean;
    readonly?: boolean;
    isLoading?: boolean;
    inputName?: string;
    handleInputChange?: Function;
    delay?: number;
}

export const AutoComplete: FunctionComponent<AutoCompleteProps> = ({
    id,
    displayName,
    control,
    options,
    handleOpen,
    disabled = false,
    readonly = false,
    isLoading = false,
    inputName,
    handleInputChange,
    delay = 0,
}) => {
    const [open, setOpen] = useState(false);
    const debounced = useDebouncedCallback(() => handleInputChange?.(), delay);

    const { field: idField, fieldState: idFieldState } = useController({
        name: id,
        control: control,
    });

    const { field: inputField } = useController({
        name: inputName ?? '',
        control: control,
    });

    return (
        <Autocomplete
            clearOnBlur={true}
            {...idField}
            disabled={disabled}
            loading={isLoading}
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
                    console.log('input');
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
                    label={displayName}
                    variant='standard'
                    color={idFieldState.error?.message && (idFieldState.isTouched || idField.value) ? 'error' : 'success'}
                    focused={!idFieldState.error?.message && (idFieldState.isTouched || !!idField.value)}
                    error={!!idFieldState.error?.message && (idFieldState.isTouched || !!idField.value)}
                    helperText={idFieldState.error?.message && (idFieldState.isTouched || idField.value) ? idFieldState.error?.message : ''}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};
