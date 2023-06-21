import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { CustomTable, Pagination, StyledCell } from '../../../components/Table';
import { SelectStatus } from '../../../components/UI/Selects/SelectStatus';
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
                            <StyledCell key={title}>{title}</StyledCell>
                        ))}
                    </>
                }
            >
                {doctors.map((doctor) => (
                    <StyledDoctorRow key={doctor.id} hover>
                        <StyledCell onClick={() => handleRowClick(doctor.id)}>{doctor.fullName}</StyledCell>
                        <StyledCell onClick={() => handleRowClick(doctor.id)}>{doctor.specializationName}</StyledCell>
                        <StyledCell>
                            <SelectStatus value={doctor.status} handleChange={(value) => mutate({ id: doctor.id, status: value })} />
                        </StyledCell>
                        <StyledCell onClick={() => handleRowClick(doctor.id)}>
                            {dayjs(doctor.dateOfBirth).format(dateViewFormat)}
                        </StyledCell>
                        <StyledCell onClick={() => handleRowClick(doctor.id)}>{doctor.officeAddress}</StyledCell>
                    </StyledDoctorRow>
                ))}
            </CustomTable>

            {doctors.length === 0 ? (
                <NoDoctorsContainer>
                    <Typography>No doctors</Typography>
                </NoDoctorsContainer>
            ) : (
                <Pagination pagingData={pagingData} handlePageChange={handlePageChange} />
            )}

            {isLoading && <Loader />}
        </>
    );
};
