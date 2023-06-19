import { TablePagination, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { CustomCell, CustomTable } from '../../../components/Table';
import { SelectStatus } from '../../../components/UI/SelectStatus';
import { AppRoutes } from '../../../constants/AppRoutes';
import { dateViewFormat } from '../../../constants/Formats';
import { useChangeDoctorStatusCommand } from '../../../hooks/requests/doctors';
import { DoctorsTableProps } from './DoctorsTable.interface';
import { NoDoctorsContainer, StyledDoctorRow } from './DoctorsTable.styles';
import { DoctorsTableHeader } from './data/doctorsTableHeader';

export const DoctorsTable: FunctionComponent<DoctorsTableProps> = ({ doctors, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const { mutate, isLoading } = useChangeDoctorStatusCommand();

    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.DoctorProfile.replace(':id', `${id}`)), [navigate]);

    return (
        <>
            <CustomTable
                header={
                    <>
                        {DoctorsTableHeader.map((title) => (
                            <CustomCell key={title}>{title}</CustomCell>
                        ))}
                    </>
                }
            >
                {doctors.map((doctor) => (
                    <StyledDoctorRow key={doctor.id} hover>
                        <CustomCell handleClick={() => handleRowClick(doctor.id)}>{doctor.fullName}</CustomCell>
                        <CustomCell handleClick={() => handleRowClick(doctor.id)}>{doctor.specializationName}</CustomCell>
                        <CustomCell>
                            <SelectStatus value={doctor.status} handleChange={(value) => mutate({ id: doctor.id, status: value })} />
                        </CustomCell>
                        <CustomCell handleClick={() => handleRowClick(doctor.id)}>
                            {dayjs(doctor.dateOfBirth).format(dateViewFormat)}
                        </CustomCell>
                        <CustomCell handleClick={() => handleRowClick(doctor.id)}>{doctor.officeAddress}</CustomCell>
                    </StyledDoctorRow>
                ))}
            </CustomTable>

            {doctors.length === 0 ? (
                <NoDoctorsContainer>
                    <Typography>No doctors</Typography>
                </NoDoctorsContainer>
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

            {isLoading && <Loader />}
        </>
    );
};
