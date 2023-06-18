import { TableCell } from '@mui/material';
import { FunctionComponent } from 'react';
import { CustomCellProps } from './CustomCell.interface';

export const CustomCell: FunctionComponent<CustomCellProps> = ({ children }) => {
    return <TableCell align='center'>{children}</TableCell>;
};
