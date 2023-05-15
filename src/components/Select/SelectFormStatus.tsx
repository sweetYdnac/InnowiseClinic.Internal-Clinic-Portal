import { MenuItem, Select } from '@mui/material';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';
import { AccountStatuses, getStatusLabel } from '../../constants/AccountStatuses';

interface SelectFormStatusProps {
    id: string;
    control: Control<any, any>;
}

export const SelectFormStatus: FunctionComponent<SelectFormStatusProps> = ({ id, control }) => {
    return (
        <Controller
            name={id}
            control={control}
            render={({ field, fieldState }) => (
                <Select variant='standard' sx={{ m: 1, width: '75%' }} {...field}>
                    {Object.keys(AccountStatuses)
                        .filter((v) => isNaN(Number(v)))
                        .map((status, index) => (
                            <MenuItem key={index} value={AccountStatuses[status as keyof typeof AccountStatuses]}>
                                {getStatusLabel(AccountStatuses[status as keyof typeof AccountStatuses])}
                            </MenuItem>
                        ))}
                </Select>
            )}
        />
    );
};
