import { yupResolver } from '@hookform/resolvers/yup';
import DescriptionIcon from '@mui/icons-material/Description';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { dateViewFormat, timeViewFormat } from '../../../constants/Formats';
import { useGetPatientHistoryQuery } from '../../../hooks/requests/appointments';
import { usePatientHistoryValidator } from '../../../hooks/validators/appointments/patientHistory';
import { AppRoutes } from '../../../constants/AppRoutes';
import { IPagedRequest } from '../../../types/common/Requests';

export const PatientHistory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { initialValues, validationScheme } = usePatientHistoryValidator({ currentPage: 1, pageSize: 10 } as IPagedRequest);
    const { setValue, watch } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { data: history, isFetching: isFetchingHistory } = useGetPatientHistoryQuery(id as string, watch(), true);

    const handleAppointmentResultClick = useCallback(
        (resultId: string) => navigate(AppRoutes.AppointmentResult.replace(':id', `${resultId}`)),
        [navigate]
    );

    const handlePageChange = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => setValue('currentPage', page + 1),
        [setValue]
    );

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Date</TableCell>
                            <TableCell align='center'>Time</TableCell>
                            <TableCell align='center'>Doctor full name</TableCell>
                            <TableCell align='center'>Service</TableCell>
                            <TableCell align='center'>Manage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history &&
                            history.items.map((item) => (
                                <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align='center' component='th'>
                                        {item.date.format(dateViewFormat)}
                                    </TableCell>
                                    <TableCell align='center'>{`${item.startTime.format(timeViewFormat)} - ${item.endTime.format(
                                        timeViewFormat
                                    )}`}</TableCell>
                                    <TableCell align='center'>{item.doctorFullName}</TableCell>
                                    <TableCell align='center'>{item.serviceName}</TableCell>
                                    <TableCell align='center'>
                                        <Button onClick={() => handleAppointmentResultClick(item.resultId as string)}>
                                            View result
                                            <DescriptionIcon fontSize='medium' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {history && (
                <TablePagination
                    component='div'
                    count={history.totalCount}
                    rowsPerPage={history.totalPages}
                    page={history.currentPage - 1}
                    rowsPerPageOptions={[]}
                    onPageChange={handlePageChange}
                />
            )}

            {isFetchingHistory && <Loader />}
        </>
    );
};
