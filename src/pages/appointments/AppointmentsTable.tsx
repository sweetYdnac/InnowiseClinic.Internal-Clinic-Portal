import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogWindow } from '../../components/Dialog/DialogWindow';
import { Loader } from '../../components/Loader/Loader';
import { AppRoutes } from '../../constants/AppRoutes';
import { timeSlotFormat } from '../../constants/Formats';
import { useApproveAppointmentCommand, useCancelAppointmentCommand } from '../../hooks/requests/appointments';
import { IPagingData } from '../../types/common/Responses';
import { IAppointmentResponse } from '../../types/response/appointments';

interface AppointmentsListProps {
    appointments: IAppointmentResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}

export const AppointmentsTable: FunctionComponent<AppointmentsListProps> = ({ appointments, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null);
    const { mutate: approveAppointment, isLoading: approveAppointmentLoading } = useApproveAppointmentCommand();
    const { mutate: cancelAppointment, isLoading: cancelAppointmentLoading } = useCancelAppointmentCommand(cancelAppointmentId ?? '');

    const closeDialog = () => setCancelAppointmentId(null);

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
                                <TableCell align='center'>{item.patientFullName}</TableCell>
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
                handleSubmit={() => {
                    cancelAppointment({ id: cancelAppointmentId ?? '' });
                    closeDialog();
                }}
                handleDecline={closeDialog}
            />

            {(cancelAppointmentLoading || approveAppointmentLoading) && <Loader />}
        </>
    );
};
