import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FunctionComponent, ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';

interface FilterTextfieldProps {
    id: string;
    displayName: string;
    control: Control<any, any>;
    inputMode: 'text' | 'numeric';
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

const FilterTextfield: FunctionComponent<FilterTextfieldProps> = ({
    id,
    displayName,
    control,
    inputMode,
    startAdornment,
    endAdornment,
}: FilterTextfieldProps) => {
    return (
        <Controller
            name={id}
            control={control}
            defaultValue=''
            render={({ field, fieldState }) => (
                <>
                    <TextField
                        {...field}
                        sx={{ m: 1, width: '75%' }}
                        color={(fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || field.value) ? 'error' : 'success'}
                        focused={(fieldState.error?.message?.length ?? 0) === 0 && (fieldState.isTouched || !!field.value)}
                        label={(fieldState.error?.message?.length ?? 0) > 0 && fieldState.isTouched ? 'Error' : displayName}
                        variant='standard'
                        error={(fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || !!field.value)}
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
                    />
                </>
            )}
        />
    );
};

export default FilterTextfield;
