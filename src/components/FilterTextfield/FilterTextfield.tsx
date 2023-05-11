import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FunctionComponent, ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';

interface FilterTextfieldProps {
    id: string;
    displayName: string;
    control: Control<any, any>;
    inputMode?: 'text' | 'numeric';
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

export const FilterTextfield: FunctionComponent<FilterTextfieldProps> = ({
    id,
    displayName,
    control,
    inputMode = 'text',
    startAdornment,
    endAdornment,
}: FilterTextfieldProps) => {
    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => (
                <>
                    <TextField
                        {...field}
                        sx={{ m: 1, width: '75%' }}
                        color={fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success'}
                        focused={!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                        label={fieldState.error?.message && fieldState.isTouched ? 'Error' : displayName}
                        variant='standard'
                        error={!!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                        helperText={fieldState.error?.message}
                        InputProps={{
                            inputMode: inputMode,
                            startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
                            endAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </>
            )}
        />
    );
};
