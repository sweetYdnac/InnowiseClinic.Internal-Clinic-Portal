import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton, TablePagination, Typography } from '@mui/material';
import { FunctionComponent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogWindow } from '../../../components/Dialog';
import { Loader } from '../../../components/Loader';
import { CustomCell, CustomTable } from '../../../components/Table';
import { AppRoutes } from '../../../constants/AppRoutes';
import { useRemovePatientCommand } from '../../../hooks/requests/patients';
import { PatientsTableProps } from './PatientsTable.interface';
import { NoPatientsContainer, StyledPatientRow } from './PatientsTable.styles';
import { PatientsTableHeader } from './data/patientsTableHeader';
import { RemovePatientDialogMessages } from './data/removePatientDialogMessages';

export const PatientsTable: FunctionComponent<PatientsTableProps> = ({ patients, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
    const { mutate, isLoading } = useRemovePatientCommand();

    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.PatientProfile.replace(':id', `${id}`)), [navigate]);

    const handleRemovePatient = useCallback(() => {
        if (deletePatientId) {
            mutate({ id: deletePatientId }, { onSuccess: () => setDeletePatientId(null) });
        }
    }, [deletePatientId, mutate]);

    return (
        <>
            <CustomTable
                header={
                    <>
                        {PatientsTableHeader.map((title) => (
                            <CustomCell key={title}>{title}</CustomCell>
                        ))}
                    </>
                }
            >
                {patients.map((patient) => (
                    <StyledPatientRow key={patient.id} hover>
                        <CustomCell handleClick={() => handleRowClick(patient.id)}>{patient.fullName}</CustomCell>
                        <CustomCell handleClick={() => handleRowClick(patient.id)}>{patient.phoneNumber}</CustomCell>
                        <CustomCell handleClick={() => setDeletePatientId(patient.id)}>
                            <IconButton>
                                <DeleteForeverIcon fontSize='medium' />
                            </IconButton>
                        </CustomCell>
                    </StyledPatientRow>
                ))}
            </CustomTable>

            {patients.length === 0 ? (
                <NoPatientsContainer>
                    <Typography>No patients</Typography>
                </NoPatientsContainer>
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
                isOpen={!!deletePatientId}
                title={RemovePatientDialogMessages.title}
                content={RemovePatientDialogMessages.content}
                handleSubmit={handleRemovePatient}
                handleDecline={() => setDeletePatientId(null)}
            />

            {isLoading && <Loader />}
        </>
    );
};
