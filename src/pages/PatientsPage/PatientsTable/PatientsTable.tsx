import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton, Typography } from '@mui/material';
import { FunctionComponent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogWindow } from '../../../components/Dialog';
import { Loader } from '../../../components/Loader';
import { CustomTable, Pagination, StyledCell } from '../../../components/Table';
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
                            <StyledCell key={title}>{title}</StyledCell>
                        ))}
                    </>
                }
            >
                {patients.map((patient) => (
                    <StyledPatientRow key={patient.id} hover>
                        <StyledCell onClick={() => handleRowClick(patient.id)}>{patient.fullName}</StyledCell>
                        <StyledCell onClick={() => handleRowClick(patient.id)}>{patient.phoneNumber}</StyledCell>
                        <StyledCell onClick={() => setDeletePatientId(patient.id)}>
                            <IconButton>
                                <DeleteForeverIcon fontSize='medium' />
                            </IconButton>
                        </StyledCell>
                    </StyledPatientRow>
                ))}
            </CustomTable>

            {patients.length === 0 ? (
                <NoPatientsContainer>
                    <Typography>No patients</Typography>
                </NoPatientsContainer>
            ) : (
                <Pagination pagingData={pagingData} handlePageChange={handlePageChange} />
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
