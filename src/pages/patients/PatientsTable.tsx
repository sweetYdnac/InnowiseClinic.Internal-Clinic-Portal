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
import { useRemovePatientCommand } from '../../hooks/requests/patients';
import { AppRoutes } from '../../routes/AppRoutes';
import { IPagingData } from '../../types/common/Responses';
import { IPatientInformationResponse } from '../../types/response/patients';

interface PatientsTableProps {
    patients: IPatientInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}

export const PatientsTable: FunctionComponent<PatientsTableProps> = ({ patients, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
    const { mutate, isLoading } = useRemovePatientCommand();

    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.PatientProfile.replace(':id', `${id}`)), [navigate]);

    const handleRemovePatient = useCallback(() => {
        if (deletePatientId) {
            mutate({ id: deletePatientId }, { onSuccess: () => setDeletePatientId(null) });
        }
    }, [deletePatientId, mutate]);

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
                        {patients.map((patient) => (
                            <TableRow key={patient.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}>
                                <TableCell onClick={() => handleRowClick(patient.id)} align='center'>
                                    {patient.fullName}
                                </TableCell>
                                <TableCell onClick={() => handleRowClick(patient.id)} align='center'>
                                    {patient.phoneNumber}
                                </TableCell>
                                <TableCell align='center' onClick={() => setDeletePatientId(patient.id)}>
                                    <IconButton>
                                        <DeleteForeverIcon fontSize='medium' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {patients.length === 0 ? (
                <Box display={'flex'} justifyContent={'center'} marginTop={2}>
                    <Typography alignSelf={'center'}>No patients</Typography>
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
                isOpen={!!deletePatientId}
                title='Remove patient?'
                content='Do you really want to delete? Data will be lost.'
                handleSubmit={handleRemovePatient}
                handleDecline={() => setDeletePatientId(null)}
            />

            {isLoading && <Loader />}
        </>
    );
};
