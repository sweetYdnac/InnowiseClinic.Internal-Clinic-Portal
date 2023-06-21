import { Visibility, VisibilityOff } from '@mui/icons-material';
import KeyIcon from '@mui/icons-material/Key';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { FunctionComponent, useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useStyles } from '../styles';
import { PasswordInputProps } from './PasswordInput.interface';

export const PasswordInput: FunctionComponent<PasswordInputProps> = ({ id, control, displayName }: PasswordInputProps) => {
    const { classes } = useStyles();
    const [showPassword, setShowPassword] = useState(false);

    const displayPassword = useCallback((_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setShowPassword(true), []);
    const hidePassword = useCallback((_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setShowPassword(false), []);

    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => (
                <FormControl
                    className={classes.textField}
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
                                <IconButton onClick={displayPassword} onMouseDown={hidePassword}>
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
