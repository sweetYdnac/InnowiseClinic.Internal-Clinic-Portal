import { Paper, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { FunctionComponent } from 'react';
import { CustomTableProps } from './CustomTable.interface';
import { StyledTable } from './CustomTable.styles';

export const CustomTable: FunctionComponent<CustomTableProps> = ({ header, children }) => {
    return (
        <TableContainer component={Paper}>
            <StyledTable size='small'>
                <TableHead>
                    <TableRow>{header}</TableRow>y
                </TableHead>
                <TableBody>{children}</TableBody>
            </StyledTable>
        </TableContainer>
    );
};
