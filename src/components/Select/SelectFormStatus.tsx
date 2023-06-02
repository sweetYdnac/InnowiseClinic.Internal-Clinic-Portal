import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';
import { AccountStatuses, getStatusLabel } from '../../constants/AccountStatuses';

interface SelectFormStatusProps {
    id: string;
    control: Control<any, any>;
    readonly?: boolean;
}

export const SelectFormStatus: FunctionComponent<SelectFormStatusProps> = ({ id, control, readonly }) => {
    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => (
                <FormControl
                    variant='standard'
                    sx={{ m: 1, width: '75%' }}
                    color={fieldState.error?.message && (fieldState.isTouched || field.value) ? 'error' : 'success'}
                    focused={!readonly && !fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                    error={!!fieldState.error?.message && (fieldState.isTouched || !!field.value)}
                >
                    <InputLabel>Status</InputLabel>
                    <Select readOnly={readonly} {...field}>
                        {Object.keys(AccountStatuses)
                            .filter((v) => isNaN(Number(v)) && v !== AccountStatuses[AccountStatuses.None])
                            .map((status, index) => (
                                <MenuItem key={index} value={AccountStatuses[status as keyof typeof AccountStatuses]}>
                                    {getStatusLabel(AccountStatuses[status as keyof typeof AccountStatuses])}
                                </MenuItem>
                            ))}
                    </Select>
                    <FormHelperText>
                        {fieldState.error?.message && (fieldState.isTouched || field.value) ? fieldState.error?.message : ''}
                    </FormHelperText>
                </FormControl>
            )}
        />
    );
};
