import { Textarea, Typography } from '@mui/joy';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { FunctionComponent } from 'react';
import { Controller } from 'react-hook-form';
import { useStyles } from '../styles';
import { TextAreaProps } from './TextArea.interface';

export const TextArea: FunctionComponent<TextAreaProps> = ({ id, control, displayName, readonly = false }) => {
    const { classes } = useStyles();

    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => {
                const color = readonly
                    ? 'neutral'
                    : !!fieldState.error?.message && (fieldState.isTouched || !!field.value)
                    ? 'danger'
                    : 'success';

                return (
                    <FormControl className={classes.textField} variant='outlined'>
                        <FormLabel>
                            <Typography level='body3' color={color}>
                                {displayName}
                            </Typography>
                        </FormLabel>
                        <Textarea
                            {...field}
                            readOnly={readonly}
                            error={!!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                            color={color}
                        />
                        <FormHelperText>
                            <Typography level='body3' color='danger'>
                                {fieldState.error?.message}
                            </Typography>
                        </FormHelperText>
                    </FormControl>
                );
            }}
        />
    );
};
