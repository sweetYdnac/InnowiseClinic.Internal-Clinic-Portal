import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FunctionComponent, useState } from 'react';
import { AppointmentsService } from '../../api/services/AppointmentsService';
import { DialogWindow } from '../../components/Dialog/DialogWindow';
import { Loader } from '../../components/Loader/Loader';
import { timeViewFormat } from '../../constants/formats';
import { IPagingData } from '../../types/common/Responses';
import { IAppointmentResponse } from '../../types/response/appointments';

interface AppointmentsListProps {
    appointments: IAppointmentResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
    fetchAppointments: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<IAppointmentResponse[], Error>>;
}

export const AppointmentsTable: FunctionComponent<AppointmentsListProps> = ({
    appointments,
    pagingData,
    handlePageChange,
    fetchAppointments,
}) => {
    const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null);
    const closeDialog = () => setCancelAppointmentId(null);

    const { mutate: cancelAppointment, isLoading: cancelAppointmentLoading } = useMutation({
        mutationFn: async () => await AppointmentsService.cancel(cancelAppointmentId as string),
        onSuccess: () => {
            closeDialog();
            fetchAppointments();
        },
        retry: false,
    });

    const { mutate: approveAppointment, isLoading: approveAppointmentLoading } = useMutation({
        mutationFn: async (id: string) => await AppointmentsService.approve(id),
        onSuccess: () => fetchAppointments(),
        retry: false,
    });

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
                                <TableCell align='center'>{`${dayjs(item.startTime, timeViewFormat).format(timeViewFormat)} - ${dayjs(
                                    item.endTime,
                                    timeViewFormat
                                ).format(timeViewFormat)}`}</TableCell>
                                <TableCell align='center'>{item.doctorFullName}</TableCell>
                                <TableCell align='center'>{item.patientFullName}</TableCell>
                                <TableCell align='center'>{item.patientPhoneNumber}</TableCell>
                                <TableCell align='center'>{item.serviceName}</TableCell>
                                <TableCell align='center'>
                                    <Button>Reschedule</Button>
                                    {item.isApproved ? (
                                        <Button onClick={() => setCancelAppointmentId(item.id)}>Cancel</Button>
                                    ) : (
                                        <Button onClick={() => approveAppointment(item.id)}>Approve</Button>
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
                handleSubmit={cancelAppointment}
                handleDecline={closeDialog}
            />

            {(cancelAppointmentLoading || approveAppointmentLoading) && <Loader />}
        </>
    );
};
