import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { ToggleSwitch } from '../../components/Switch/ToggleSwitch';
import { useChangeSpecializationStatusCommand } from '../../hooks/requests/specializations';
import { AppRoutes } from '../../routes/AppRoutes';
import { IPagingData } from '../../types/common/Responses';
import { ISpecializationResponse } from '../../types/response/specializations';

interface SpecializationsTableProps {
    specializations: ISpecializationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}

export const SpecializationsTable: FunctionComponent<SpecializationsTableProps> = ({ specializations, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const { mutate, isLoading } = useChangeSpecializationStatusCommand();
    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.SpecializationInformation.replace(':id', `${id}`)), [navigate]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Title</TableCell>
                            <TableCell align='center'>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {specializations.map((item) => (
                            <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}>
                                <TableCell onClick={() => handleRowClick(item.id)} align='center'>
                                    {item.title}
                                </TableCell>
                                <TableCell align='center'>
                                    <ToggleSwitch
                                        value={item.isActive}
                                        handleChange={(value) => mutate({ id: item.id, isActive: value })}
                                    />
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
