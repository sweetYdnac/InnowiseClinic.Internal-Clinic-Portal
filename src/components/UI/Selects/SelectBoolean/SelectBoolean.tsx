import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { useStyles } from '../../styles';
import { SelectBooleanProps } from './SelectBoolean.interface';
import { SelectBooleanItemsData } from './data/selectBooleanItemsData';

export const SelectBoolean: FunctionComponent<SelectBooleanProps> = ({ id, control, displayName }) => {
    const { classes } = useStyles();

    const { field, fieldState } = useController({
        name: id,
        control: control,
    });

    const onChange = useCallback(
        (e: SelectChangeEvent<number | 'null'>) => {
            field.onChange(e.target.value === 'null' ? null : !!e.target.value);
        },
        [field]
    );

    return (
        <FormControl
            variant='standard'
            className={classes.textField}
            color={fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success'}
            focused={!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
            error={!!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
        >
            <InputLabel>{displayName}</InputLabel>
            <Select {...field} value={field.value === null ? 'null' : +field.value} onChange={onChange} autoWidth>
                {SelectBooleanItemsData.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.displayName}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>
                {fieldState.error?.message && (fieldState.isTouched || field.value) ? fieldState.error?.message : ''}
            </FormHelperText>
        </FormControl>
    );
};
