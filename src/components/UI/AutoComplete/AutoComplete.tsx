import { Autocomplete, AutocompleteInputChangeReason, CircularProgress, TextField } from '@mui/material';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { IAutoCompleteItem } from '../../../types/common/Autocomplete';
import { useStyles } from '../styles';
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
    const { classes } = useStyles();
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

    const onOpen = useCallback(() => {
        setOpen(true);
        handleOpen?.();
    }, [handleOpen]);

    const handleClose = useCallback(() => setOpen(false), []);
    const value = useMemo(() => options.find((option) => option.id === idField.value) || null, [idField.value, options]);
    const handleValueChange = useCallback(
        (_: React.SyntheticEvent<Element, Event>, value: IAutoCompleteItem | null) => idField.onChange(value?.id || ''),
        [idField]
    );
    const onInputChange = useCallback(
        (_: React.SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
            if (reason === 'input') {
                inputField.onChange(value);
                debounced?.();
            } else if ((reason = 'clear')) {
                inputField.onChange(value);
            }
        },
        [debounced, inputField]
    );
    const isOptionEqualToValue = useCallback((option: IAutoCompleteItem, value: IAutoCompleteItem) => option.id === value.id, []);
    const getOptionLabel = useCallback((option: IAutoCompleteItem) => option.label, []);

    return (
        <Autocomplete
            className={classes.textField}
            clearOnBlur={true}
            {...idField}
            disabled={disabled}
            readOnly={readonly}
            loading={isFetching || debounced.isPending()}
            open={open}
            onOpen={onOpen}
            onClose={handleClose}
            defaultValue={value}
            value={value}
            onChange={handleValueChange}
            onInputChange={onInputChange}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={getOptionLabel}
            options={options}
            autoHighlight
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
