import DescriptionIcon from '@mui/icons-material/Description';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {
    Box,
    Button,
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
import dayjs from 'dayjs';
import { FunctionComponent, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { timeSlotFormat } from '../../../constants/Formats';
import { AppRoutes } from '../../../routes/AppRoutes';
import { IPagingData } from '../../../types/common/Responses';
import { ICreateAppointmentResultDTO } from '../../../types/dto/appointmentResults';
import { IDoctorScheduledAppointmentResponse } from '../../../types/response/doctors';

interface DoctorScheduleTableProps {
    appointments: IDoctorScheduledAppointmentResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}

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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Time</TableCell>
                            <TableCell align='center'>Patient's full name</TableCell>
                            <TableCell align='center'>Service</TableCell>
                            <TableCell align='center'>Status</TableCell>
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
                                <TableCell align='center'>
                                    {item.isApproved ? (
                                        <Link to={AppRoutes.PatientProfile.replace(':id', `${item.patientId}`)}>
                                            {item.patientFullName}
                                        </Link>
                                    ) : (
                                        item.patientFullName
                                    )}
                                </TableCell>
                                <TableCell align='center'>{item.serviceName}</TableCell>
                                <TableCell align='center'>{item.isApproved ? 'Approved' : 'Not Approved'}</TableCell>
                                <TableCell align='center'>
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {appointments.length === 0 ? (
                <Box display={'flex'} justifyContent={'center'} marginTop={2}>
                    <Typography alignSelf={'center'}>No appointments</Typography>
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
        </>
    );
};
