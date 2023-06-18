import { Button, TablePagination, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DialogWindow } from '../../../components/Dialog';
import { Loader } from '../../../components/Loader';
import { CustomCell, CustomTable } from '../../../components/Table';
import { AppRoutes } from '../../../constants/AppRoutes';
import { timeSlotFormat } from '../../../constants/Formats';
import { useApproveAppointmentCommand, useCancelAppointmentCommand } from '../../../hooks/requests/appointments';
import { AppointmentsListProps } from './AppointmentsTable.interface';
import { NoAppointmentsContainer, StyledRow } from './AppointmentsTable.styles';

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
            <CustomTable
                header={
                    <>
                        <CustomCell>Time</CustomCell>
                        <CustomCell>Doctor's full name</CustomCell>
                        <CustomCell>Patient's full name</CustomCell>
                        <CustomCell>Patient's phone number</CustomCell>
                        <CustomCell>Service</CustomCell>
                        <CustomCell>Manage</CustomCell>
                    </>
                }
            >
                {appointments.map((item) => (
                    <StyledRow key={item.id} hover>
                        <CustomCell>{`${dayjs(item.startTime, timeSlotFormat).format(timeSlotFormat)} - ${dayjs(
                            item.endTime,
                            timeSlotFormat
                        ).format(timeSlotFormat)}`}</CustomCell>
                        <CustomCell>{item.doctorFullName}</CustomCell>
                        <CustomCell>
                            <Link to={AppRoutes.PatientProfile.replace(':id', `${item.patientId}`)}>{item.patientFullName}</Link>
                        </CustomCell>
                        <CustomCell>{item.patientPhoneNumber}</CustomCell>
                        <CustomCell>{item.serviceName}</CustomCell>
                        <CustomCell>
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
                        </CustomCell>
                    </StyledRow>
                ))}
            </CustomTable>

            {appointments.length === 0 ? (
                <NoAppointmentsContainer>
                    <Typography>No appointments</Typography>
                </NoAppointmentsContainer>
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
