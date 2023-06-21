import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton, Typography } from '@mui/material';
import { FunctionComponent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogWindow } from '../../../components/Dialog';
import { Loader } from '../../../components/Loader';
import { CustomTable, Pagination, StyledCell } from '../../../components/Table';
import { AppRoutes } from '../../../constants/AppRoutes';
import { useRemoveReceptionistCommand } from '../../../hooks/requests/receptionists';
import { ReceptionistsTableProps } from './ReceptionistsTable.interface';
import { NoReceptionistContainer, StyledReceptionistRow } from './ReceptionistsTable.styles';
import { ReceptionistsTableHeader } from './data/receptionistsTableHeader';
import { RemoveReceptionistDialogMessages } from './data/removeReceptionistDialogMessages';

export const ReceptionistsTable: FunctionComponent<ReceptionistsTableProps> = ({ receptionists, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const [deleteReceptionistId, setDeleteReceptionistId] = useState<string | null>(null);
    const { mutate, isLoading } = useRemoveReceptionistCommand();

    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.ReceptionistProfile.replace(':id', `${id}`)), [navigate]);

    const handleRemovePatient = useCallback(() => {
        if (deleteReceptionistId) {
            mutate({ id: deleteReceptionistId }, { onSuccess: () => setDeleteReceptionistId(null) });
        }
    }, [deleteReceptionistId, mutate]);

    return (
        <>
            <CustomTable
                header={
                    <>
                        {ReceptionistsTableHeader.map((title) => (
                            <StyledCell key={title}>{title}</StyledCell>
                        ))}
                    </>
                }
            >
                {receptionists.map((receptionist) => (
                    <StyledReceptionistRow key={receptionist.id} hover>
                        <StyledCell onClick={() => handleRowClick(receptionist.id)}>{receptionist.fullName}</StyledCell>
                        <StyledCell onClick={() => handleRowClick(receptionist.id)}>{receptionist.officeAddress}</StyledCell>
                        <StyledCell onClick={() => setDeleteReceptionistId(receptionist.id)}>
                            <IconButton>
                                <DeleteForeverIcon fontSize='medium' />
                            </IconButton>
                        </StyledCell>
                    </StyledReceptionistRow>
                ))}
            </CustomTable>

            {receptionists.length === 0 ? (
                <NoReceptionistContainer>
                    <Typography>No receptionists</Typography>
                </NoReceptionistContainer>
            ) : (
                <Pagination pagingData={pagingData} handlePageChange={handlePageChange} />
            )}

            <DialogWindow
                isOpen={!!deleteReceptionistId}
                title={RemoveReceptionistDialogMessages.title}
                content={RemoveReceptionistDialogMessages.content}
                handleSubmit={handleRemovePatient}
                handleDecline={() => setDeleteReceptionistId(null)}
            />

            {isLoading && <Loader />}
        </>
    );
};
