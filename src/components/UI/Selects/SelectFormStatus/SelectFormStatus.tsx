import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import { FunctionComponent } from 'react';
import { Controller } from 'react-hook-form';
import { useStyles } from '../../styles';
import { AccountStatusesItems } from '../helpers/AccountStatusesItems';
import { SelectFormStatusProps } from './SelectFormStatus.interface';

export const SelectFormStatus: FunctionComponent<SelectFormStatusProps> = ({ id, control, readonly }) => {
    const { classes } = useStyles();

    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => (
                <FormControl
                    variant='standard'
                    className={classes.textField}
                    color={fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success'}
                    focused={!readonly && !fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                    error={!!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                >
                    <InputLabel>Status</InputLabel>
                    <Select readOnly={readonly} {...field}>
                        {AccountStatusesItems}
                    </Select>
                    <FormHelperText>
                        {fieldState.error?.message && (fieldState.isTouched || field.value) ? fieldState.error?.message : ''}
                    </FormHelperText>
                </FormControl>
            )}
        />
    );
};
