import { Select, SelectChangeEvent } from '@mui/material';
import { FunctionComponent, useCallback, useState } from 'react';
import { useStyles } from '../../styles';
import { AccountStatusesItems } from '../helpers/AccountStatusesItems';
import { SelectStatusProps } from './SelectStatus.interface';

export const SelectStatus: FunctionComponent<SelectStatusProps> = ({ value, handleChange }) => {
    const { classes } = useStyles();
    const [status, setStatus] = useState(value);

    const onChange = useCallback(
        (e: SelectChangeEvent<number>) => {
            setStatus(e.target.value as number);
            handleChange(e.target.value as number);
        },
        [handleChange]
    );

    return (
        <Select variant='standard' className={classes.textField} value={status} onChange={onChange}>
            {AccountStatusesItems}
        </Select>
    );
};
