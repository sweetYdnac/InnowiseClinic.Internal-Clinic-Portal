import { Visibility, VisibilityOff } from '@mui/icons-material';
import KeyIcon from '@mui/icons-material/Key';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { FunctionComponent, useState } from 'react';
import { Controller } from 'react-hook-form';
import { PasswordInputProps } from './PasswordInput.interface';

export const PasswordInput: FunctionComponent<PasswordInputProps> = ({ id, control, displayName }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => (
                <FormControl
                    sx={{ m: 1, width: '75%' }}
                    error={!!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                    color={fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success'}
                    focused={!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                    required
                >
                    <InputLabel>{(fieldState.error?.message?.length ?? 0) > 0 && fieldState.isTouched ? 'Error' : displayName}</InputLabel>
                    <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        startAdornment={
                            <InputAdornment position='start'>
                                <KeyIcon />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton onClick={() => setShowPassword(true)} onMouseDown={() => setShowPassword(false)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>{fieldState.isTouched ? fieldState.error?.message : ''}</FormHelperText>
                </FormControl>
            )}
        />
    );
};
