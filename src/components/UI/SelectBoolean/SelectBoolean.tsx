import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { FunctionComponent } from 'react';
import { Controller } from 'react-hook-form';
import { useStyles } from '../styles';
import { SelectBooleanProps } from './SelectBoolean.interface';

export const SelectBoolean: FunctionComponent<SelectBooleanProps> = ({ id, control, displayName }) => {
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
                    focused={!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                    error={!!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                >
                    <InputLabel>{displayName}</InputLabel>
                    <Select
                        {...field}
                        value={field.value === null ? 'null' : +field.value}
                        onChange={(e) => field.onChange(e.target.value === 'null' ? null : !!e.target.value)}
                        onBlur={() => field.onBlur()}
                        autoWidth
                    >
                        <MenuItem value={'null'}>All</MenuItem>
                        <MenuItem value={1}>Approved</MenuItem>
                        <MenuItem value={0}>Not approved</MenuItem>
                    </Select>
                    <FormHelperText>
                        {fieldState.error?.message && (fieldState.isTouched || field.value) ? fieldState.error?.message : ''}
                    </FormHelperText>
                </FormControl>
            )}
        />
    );
};
