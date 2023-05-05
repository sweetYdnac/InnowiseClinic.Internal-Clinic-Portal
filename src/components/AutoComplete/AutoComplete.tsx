import { Autocomplete, TextField } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { IAutoCompleteInput, IAutoCompleteItem } from '../../types/common/Autocomplete';

interface AutoCompleteProps {
    id: string;
    displayName: string;
    control: Control<any, any>;
    options: IAutoCompleteItem[];
    disabled?: boolean;
    readonly?: boolean;
}

const AutoComplete: FunctionComponent<AutoCompleteProps> = ({ id, displayName, control, options, disabled = false, readonly = false }) => {
    const [open, setOpen] = useState(false);

    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => (
                <>
                    <Autocomplete
                        {...field}
                        disabled={disabled}
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        defaultValue={options.find((option) => option.id === (field.value as IAutoCompleteInput).id) || null}
                        value={options.find((option) => option.id === (field.value as IAutoCompleteInput).id) || null}
                        onChange={(_e, value) =>
                            field.onChange({
                                id: value?.id || null,
                                input: options.find((option) => option.id === (value?.id || null))?.label ?? '',
                            })
                        }
                        onInputChange={(_e, value) => field.onChange({ ...field.value, input: value })}
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
                                color={fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success'}
                                focused={!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                                error={!!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                                helperText={
                                    fieldState.error?.message && (fieldState.isTouched || field.value) ? fieldState.error?.message : ''
                                }
                            />
                        )}
                    />
                </>
            )}
        />
    );
};

export default AutoComplete;
