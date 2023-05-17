import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { ToggleSwitch } from '../../components/Switch/ToggleSwitch';
import { AppRoutes } from '../../constants/AppRoutes';
import { useChangeOfficeStatusCommand } from '../../hooks/requests/offices';
import { IPagingData } from '../../types/common/Responses';
import { IOfficeInformationResponse } from '../../types/response/offices';

interface OfficesTableProps {
    offices: IOfficeInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}

export const OfficesTable: FunctionComponent<OfficesTableProps> = ({ offices, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const { mutate, isLoading } = useChangeOfficeStatusCommand();

    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.OfficeInformation.replace(':id', `${id}`)), [navigate]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Address</TableCell>
                            <TableCell align='center'>Status</TableCell>
                            <TableCell align='center'>Phone number</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {offices.map((office) => (
                            <TableRow key={office.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}>
                                <TableCell onClick={() => handleRowClick(office.id)} align='center'>
                                    {office.address}
                                </TableCell>
                                <TableCell align='center'>
                                    <ToggleSwitch
                                        value={office.isActive}
                                        handleChange={(value) => mutate({ id: office.id, isActive: value })}
                                    />
                                </TableCell>
                                <TableCell onClick={() => handleRowClick(office.id)} align='center'>
                                    {office.registryPhoneNumber}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component='div'
                count={pagingData.totalCount}
                rowsPerPage={pagingData.pageSize}
                page={pagingData.currentPage - 1}
                rowsPerPageOptions={[]}
                onPageChange={handlePageChange}
            />

            {isLoading && <Loader />}
        </>
    );
};
