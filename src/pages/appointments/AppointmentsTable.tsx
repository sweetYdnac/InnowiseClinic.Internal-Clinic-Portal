import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DialogWindow } from '../../components/Dialog/DialogWindow';
import { Loader } from '../../components/Loader/Loader';
import { timeSlotFormat } from '../../constants/Formats';
import { useApproveAppointmentCommand, useCancelAppointmentCommand } from '../../hooks/requests/appointments';
import { AppRoutes } from '../../routes/AppRoutes';
import { IPagingData } from '../../types/common/Responses';
import { IAppointmentResponse } from '../../types/response/appointments';

interface AppointmentsListProps {
    date: dayjs.Dayjs;
    appointments: IAppointmentResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}

export const AppointmentsTable: FunctionComponent<AppointmentsListProps> = ({ date, appointments, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null);
    const { mutate: approveAppointment, isLoading: approveAppointmentLoading } = useApproveAppointmentCommand(date);
    const { mutate: cancelAppointment, isLoading: cancelAppointmentLoading } = useCancelAppointmentCommand(cancelAppointmentId ?? '', date);

    const handleCancelAppointment = useCallback(() => {
        if (cancelAppointmentId) {
            cancelAppointment({ id: cancelAppointmentId }, { onSuccess: () => setCancelAppointmentId(null) });
        }
    }, [cancelAppointment, cancelAppointmentId]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Time</TableCell>
                            <TableCell align='center'>Doctor's full name</TableCell>
                            <TableCell align='center'>Patient's full name</TableCell>
                            <TableCell align='center'>Patient's phone number</TableCell>
                            <TableCell align='center'>Service</TableCell>
                            <TableCell align='center'>Manage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((item) => (
                            <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align='center'>{`${dayjs(item.startTime, timeSlotFormat).format(timeSlotFormat)} - ${dayjs(
                                    item.endTime,
                                    timeSlotFormat
                                ).format(timeSlotFormat)}`}</TableCell>
                                <TableCell align='center'>{item.doctorFullName}</TableCell>
                                <TableCell align='center'>
                                    <Link to={AppRoutes.PatientProfile.replace(':id', `${item.patientId}`)}>{item.patientFullName}</Link>
                                </TableCell>
                                <TableCell align='center'>{item.patientPhoneNumber}</TableCell>
                                <TableCell align='center'>{item.serviceName}</TableCell>
                                <TableCell align='center'>
                                    {item.isApproved ? (
                                        <Button onClick={() => setCancelAppointmentId(item.id)}>Cancel</Button>
                                    ) : (
                                        <>
                                            <Button onClick={() => navigate(AppRoutes.RescheduleAppointment.replace(':id', `${item.id}`))}>
                                                Reschedule
                                            </Button>
                                            <Button onClick={() => approveAppointment({ id: item.id })}>Approve</Button>
                                        </>
                                    )}
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

            <DialogWindow
                isOpen={cancelAppointmentId !== null}
                title='Cancel appointment'
                content='Do you really want to cancel the appointment? It will be permanently deleted.'
                handleSubmit={handleCancelAppointment}
                handleDecline={() => setCancelAppointmentId(null)}
            />

            {(cancelAppointmentLoading || approveAppointmentLoading) && <Loader />}
        </>
    );
};
