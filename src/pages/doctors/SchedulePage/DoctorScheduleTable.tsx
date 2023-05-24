import DescriptionIcon from '@mui/icons-material/Description';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { timeSlotFormat } from '../../../constants/Formats';
import { AppRoutes } from '../../../routes/AppRoutes';
import { IPagingData } from '../../../types/common/Responses';
import { IDoctorScheduledAppointmentResponse } from '../../../types/response/doctors';

interface DoctorScheduleTableProps {
    appointments: IDoctorScheduledAppointmentResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}

export const DoctorScheduleTable: FunctionComponent<DoctorScheduleTableProps> = ({ appointments, pagingData, handlePageChange }) => {
    const navigate = useNavigate();

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
                                        <Button onClick={() => navigate(AppRoutes.AppointmentResult.replace(':id', `${item.resultId}`))}>
                                            View result
                                            <DescriptionIcon fontSize='medium' />
                                        </Button>
                                    ) : (
                                        <Button onClick={() => navigate(AppRoutes.CreateAppointmentResult.replace(':id', `${item.id}`))}>
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
            <TablePagination
                component='div'
                count={pagingData.totalCount}
                rowsPerPage={pagingData.pageSize}
                page={pagingData.currentPage - 1}
                rowsPerPageOptions={[]}
                onPageChange={handlePageChange}
            />
        </>
    );
};
