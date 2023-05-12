import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Loader } from '../../components/Loader/Loader';
import { SelectStatus } from '../../components/Select/SelectStatus';
import { dateViewFormat } from '../../constants/formats';
import { useChangeDoctorStatus } from '../../hooks/doctors';
import { IPagingData } from '../../types/common/Responses';
import { IDoctorInformationResponse } from '../../types/response/doctors';

interface DoctorsTableProps {
    doctors: IDoctorInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}

export const DoctorsTable: FunctionComponent<DoctorsTableProps> = ({ doctors, pagingData, handlePageChange }) => {
    const { mutate, isLoading } = useChangeDoctorStatus();

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Full name</TableCell>
                            <TableCell align='center'>Specialization</TableCell>
                            <TableCell align='center'>Status</TableCell>
                            <TableCell align='center'>Date of birth</TableCell>
                            <TableCell align='center'>Office address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doctors.map((doctor) => (
                            <TableRow key={doctor.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align='center'>{doctor.fullName}</TableCell>
                                <TableCell align='center'>{doctor.specializationName}</TableCell>
                                <TableCell align='center'>
                                    <SelectStatus
                                        value={doctor.status}
                                        handleChange={(value) => mutate({ id: doctor.id, status: value })}
                                    />
                                </TableCell>
                                <TableCell align='center'>{dayjs(doctor.dateOfBirth).format(dateViewFormat)}</TableCell>
                                <TableCell align='center'>{doctor.officeAddress}</TableCell>
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

            {isLoading && <Loader />}
        </>
    );
};
