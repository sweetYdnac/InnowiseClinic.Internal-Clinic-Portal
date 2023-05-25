import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import { FunctionComponent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogWindow } from '../../components/Dialog/DialogWindow';
import { Loader } from '../../components/Loader/Loader';
import { useRemoveReceptionistCommand } from '../../hooks/requests/receptionists';
import { AppRoutes } from '../../routes/AppRoutes';
import { IPagingData } from '../../types/common/Responses';
import { IReceptionistsInformationResponse } from '../../types/response/receptionists';

interface ReceptionistsTableProps {
    receptionists: IReceptionistsInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}

export const ReceptionistsTable: FunctionComponent<ReceptionistsTableProps> = ({ receptionists, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const [deleteReceptionistId, setDeleteReceptionistId] = useState<string | null>(null);
    const { mutate, isLoading } = useRemoveReceptionistCommand();

    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.ReceptionistProfile.replace(':id', `${id}`)), [navigate]);

    const handleRemovePatient = useCallback(() => {
        if (deleteReceptionistId) {
            mutate({ id: deleteReceptionistId }, { onSuccess: () => setDeleteReceptionistId(null) });
        }
    }, [deleteReceptionistId, mutate]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Full name</TableCell>
                            <TableCell align='center'>Phone number</TableCell>
                            <TableCell align='center'>Manage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {receptionists.map((receptionist) => (
                            <TableRow
                                key={receptionist.id}
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                            >
                                <TableCell onClick={() => handleRowClick(receptionist.id)} align='center'>
                                    {receptionist.fullName}
                                </TableCell>
                                <TableCell onClick={() => handleRowClick(receptionist.id)} align='center'>
                                    {receptionist.officeAddress}
                                </TableCell>
                                <TableCell align='center' onClick={() => setDeleteReceptionistId(receptionist.id)}>
                                    <IconButton>
                                        <DeleteForeverIcon fontSize='medium' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {receptionists.length === 0 ? (
                <Box display={'flex'} justifyContent={'center'} marginTop={2}>
                    <Typography alignSelf={'center'}>No receptionists</Typography>
                </Box>
            ) : (
                <TablePagination
                    component='div'
                    count={pagingData.totalCount}
                    rowsPerPage={pagingData.pageSize}
                    page={pagingData.currentPage - 1}
                    rowsPerPageOptions={[]}
                    onPageChange={handlePageChange}
                />
            )}

            <DialogWindow
                isOpen={!!deleteReceptionistId}
                title='Remove patient?'
                content='Do you really want to delete? Data will be lost.'
                handleSubmit={handleRemovePatient}
                handleDecline={() => setDeleteReceptionistId(null)}
            />

            {isLoading && <Loader />}
        </>
    );
};
