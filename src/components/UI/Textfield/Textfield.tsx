import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FunctionComponent, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { useStyles } from '../styles';
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
    const { classes } = useStyles();

    const { field, fieldState } = useController({
        name: id,
        control: control,
    });

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            const value = disableWhiteSpace ? e.target.value.trim() : e.target.value;
            field.onChange(value);
        },
        [disableWhiteSpace, field]
    );

    if (workMode === 'view') {
        return (
            <TextField
                {...field}
                className={classes.textField}
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
        );
    } else if (workMode === 'edit') {
        return (
            <TextField
                {...field}
                className={classes.textField}
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
                onChange={onChange}
            />
        );
    }

    return <></>;
};
