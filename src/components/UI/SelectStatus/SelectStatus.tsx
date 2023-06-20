import { MenuItem, Select } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { AccountStatuses, getStatusLabel } from '../../../constants/AccountStatuses';
import { useStyles } from '../styles';
import { SelectStatusProps } from './SelectStatus.interface';

export const SelectStatus: FunctionComponent<SelectStatusProps> = ({ value, handleChange }) => {
    const { classes } = useStyles();
    const [status, setStatus] = useState(value);

    return (
        <Select
            variant='standard'
            className={classes.textField}
            value={status}
            onChange={(e) => {
                setStatus(e.target.value as number);
                handleChange(e.target.value as number);
            }}
        >
            {Object.keys(AccountStatuses)
                .filter((v) => isNaN(Number(v)))
                .map((status, index) => (
                    <MenuItem key={index} value={AccountStatuses[status as keyof typeof AccountStatuses]}>
                        {getStatusLabel(AccountStatuses[status as keyof typeof AccountStatuses])}
                    </MenuItem>
                ))}
        </Select>
    );
};
