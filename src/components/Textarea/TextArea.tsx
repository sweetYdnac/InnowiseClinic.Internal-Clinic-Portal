import { Textarea, Typography } from '@mui/joy';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';

interface TextAreaProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    readonly?: boolean;
}

export const TextArea: FunctionComponent<TextAreaProps> = ({ id, control, displayName, readonly = false }) => {
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
                    <FormControl sx={{ m: 1, width: '75%' }} variant='outlined'>
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
