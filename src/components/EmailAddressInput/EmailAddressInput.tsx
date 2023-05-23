import { AccountCircle } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';

interface EmailAddressInputProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
}

export const EmailAddressInput: FunctionComponent<EmailAddressInputProps> = ({ id, control, displayName }: EmailAddressInputProps) => {
    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => (
                <>
                    <TextField
                        {...field}
                        required
                        label={(fieldState.error?.message?.length ?? 0) > 0 && fieldState.isTouched ? 'Error' : displayName}
                        placeholder='example@gmail.com'
                        variant='standard'
                        error={(fieldState.error?.message?.length ?? 0) > 0 && fieldState.isTouched}
                        helperText={fieldState.isTouched ? fieldState.error?.message : ''}
                        InputProps={{
                            inputMode: 'email',
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ m: 1, width: '75%' }}
                    />
                </>
            )}
        />
    );
};
