import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { debounce } from 'debounce';
import { FunctionComponent, ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';

interface FilterTextfieldProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    inputMode?: 'text' | 'numeric';
    delay?: number;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

export const FilterTextfield: FunctionComponent<FilterTextfieldProps> = ({
    id,
    control,
    displayName,
    inputMode = 'text',
    delay = 0,
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
                        onChange={debounce(
                            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => field.onChange(e.target.value),
                            delay
                        )}
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
