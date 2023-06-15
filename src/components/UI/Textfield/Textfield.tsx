import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FunctionComponent } from 'react';
import { Controller } from 'react-hook-form';
import { TextfieldProps } from './Textfield.interface';

export const Textfield: FunctionComponent<TextfieldProps> = ({
    id,
    control,
    displayName,
    disableWhiteSpace = false,
    inputMode = 'text',
    workMode = 'view',
    placeholder,
    startAdornment,
    endAdornment,
}: TextfieldProps) => {
    if (workMode === 'view') {
        return (
            <Controller
                name={id}
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        sx={{ m: 1, width: '75%' }}
                        label={displayName}
                        variant='standard'
                        InputProps={{
                            readOnly: true,
                            inputMode: inputMode,
                            startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
                            endAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                )}
            />
        );
    } else if (workMode === 'edit') {
        return (
            <Controller
                name={id}
                control={control}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        sx={{ m: 1, width: '75%' }}
                        variant='standard'
                        placeholder={placeholder}
                        color={fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success'}
                        label={fieldState.error?.message && fieldState.isTouched ? 'Error' : displayName}
                        focused={!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                        error={!!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                        helperText={fieldState.error?.message}
                        InputProps={{
                            readOnly: false,
                            inputMode: inputMode,
                            startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
                            endAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => {
                            const value = disableWhiteSpace ? e.target.value.trim() : e.target.value;
                            field.onChange(value);
                        }}
                    />
                )}
            />
        );
    }

    return <></>;
};
