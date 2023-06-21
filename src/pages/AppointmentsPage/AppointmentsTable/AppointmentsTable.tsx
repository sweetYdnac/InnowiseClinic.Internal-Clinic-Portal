import { Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DialogWindow } from '../../../components/Dialog';
import { Loader } from '../../../components/Loader';
import { CustomTable, Pagination, StyledCell } from '../../../components/Table';
import { AppRoutes } from '../../../constants/AppRoutes';
import { timeSlotFormat } from '../../../constants/Formats';
import { useApproveAppointmentCommand, useCancelAppointmentCommand } from '../../../hooks/requests/appointments';
import { AppointmentsListProps } from './AppointmentsTable.interface';
import { NoAppointmentsContainer, StyledRow } from './AppointmentsTable.styles';
import { AppointmentsTableHeader } from './data/appointmentsTableHeader';
import { CancelAppointmentDialogMessages } from './data/cancelAppointmentDialogMessages';

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
                        {AppointmentsTableHeader.map((item) => (
                            <StyledCell key={item}>{item}</StyledCell>
                        ))}
                    </>
                }
            >
                {appointments.map((item) => (
                    <StyledRow key={item.id} hover>
                        <StyledCell>{`${dayjs(item.startTime, timeSlotFormat).format(timeSlotFormat)} - ${dayjs(
                            item.endTime,
                            timeSlotFormat
                        ).format(timeSlotFormat)}`}</StyledCell>
                        <StyledCell>{item.doctorFullName}</StyledCell>
                        <StyledCell>
                            <Link to={AppRoutes.PatientProfile.replace(':id', `${item.patientId}`)}>{item.patientFullName}</Link>
                        </StyledCell>
                        <StyledCell>{item.patientPhoneNumber}</StyledCell>
                        <StyledCell>{item.serviceName}</StyledCell>
                        <StyledCell>
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
                        </StyledCell>
                    </StyledRow>
                ))}
            </CustomTable>

            {appointments.length === 0 ? (
                <NoAppointmentsContainer>
                    <Typography>No appointments</Typography>
                </NoAppointmentsContainer>
            ) : (
                <Pagination pagingData={pagingData} handlePageChange={handlePageChange} />
            )}

            <DialogWindow
                isOpen={cancelAppointmentId !== null}
                title={CancelAppointmentDialogMessages.title}
                content={CancelAppointmentDialogMessages.content}
                handleSubmit={handleCancelAppointment}
                handleDecline={() => setCancelAppointmentId(null)}
            />

            {(cancelAppointmentLoading || approveAppointmentLoading) && <Loader />}
        </>
    );
};
