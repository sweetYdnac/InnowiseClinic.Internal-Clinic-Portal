import DescriptionIcon from '@mui/icons-material/Description';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomTable, Pagination, StyledCell } from '../../../components/Table';
import { AppRoutes } from '../../../constants/AppRoutes';
import { timeSlotFormat } from '../../../constants/Formats';
import { ICreateAppointmentResultDTO } from '../../../types/dto/appointmentResults';
import { IDoctorScheduledAppointmentResponse } from '../../../types/response/doctors';
import { DoctorScheduleTableProps } from './DoctorScheduleTable.interface';
import { NoDoctorsContainer, StyledDoctorRow } from './DoctorScheduleTable.styles';
import { DoctorScheduleTableHeader } from './data/doctorScheduleTableHeader';

export const DoctorScheduleTable: FunctionComponent<DoctorScheduleTableProps> = ({ appointments, pagingData, handlePageChange }) => {
    const navigate = useNavigate();

    const handleOpenCreateAppointmentResultPage = useCallback(
        (appointment: IDoctorScheduledAppointmentResponse) => {
            navigate(AppRoutes.CreateAppointmentResult.replace(':id', `${appointment.id}`), {
                state: {
                    patientFullName: appointment.patientFullName,
                    patientDateOfBirth: appointment.patientDateOfBirth,
                    doctorFullName: appointment.doctorFullName,
                    doctorSpecializationName: appointment.doctorSpecializationName,
                    serviceName: appointment.serviceName,
                } as ICreateAppointmentResultDTO,
            });
        },
        [navigate]
    );

    const handleOpenViewAppointmentResultPage = useCallback(
        (resultId: string | null) => navigate(AppRoutes.AppointmentResult.replace(':id', `${resultId}`)),
        [navigate]
    );

    return (
        <>
            <CustomTable
                header={
                    <>
                        {DoctorScheduleTableHeader.map((title) => (
                            <StyledCell key={title}>{title}</StyledCell>
                        ))}
                    </>
                }
            >
                {appointments.map((item) => (
                    <StyledDoctorRow key={item.id} hover>
                        <StyledCell>{`${dayjs(item.startTime, timeSlotFormat).format(timeSlotFormat)} - ${dayjs(
                            item.endTime,
                            timeSlotFormat
                        ).format(timeSlotFormat)}`}</StyledCell>
                        <StyledCell>
                            {item.isApproved ? (
                                <Link to={AppRoutes.PatientProfile.replace(':id', `${item.patientId}`)}>{item.patientFullName}</Link>
                            ) : (
                                item.patientFullName
                            )}
                        </StyledCell>
                        <StyledCell>{item.serviceName}</StyledCell>
                        <StyledCell>{item.isApproved ? 'Approved' : 'Not Approved'}</StyledCell>
                        <StyledCell>
                            {item.resultId ? (
                                <Button onClick={() => handleOpenViewAppointmentResultPage(item.resultId)}>
                                    View result
                                    <DescriptionIcon fontSize='medium' />
                                </Button>
                            ) : (
                                <Button onClick={() => handleOpenCreateAppointmentResultPage(item)}>
                                    Add result
                                    <NoteAddIcon fontSize='medium' />
                                </Button>
                            )}
                        </StyledCell>
                    </StyledDoctorRow>
                ))}
            </CustomTable>

            {appointments.length === 0 ? (
                <NoDoctorsContainer>
                    <Typography>No Doctors</Typography>
                </NoDoctorsContainer>
            ) : (
                <Pagination pagingData={pagingData} handlePageChange={handlePageChange} />
            )}
        </>
    );
};
