import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton, TablePagination, Typography } from '@mui/material';
import { FunctionComponent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogWindow } from '../../../components/Dialog';
import { Loader } from '../../../components/Loader';
import { CustomCell, CustomTable } from '../../../components/Table';
import { AppRoutes } from '../../../constants/AppRoutes';
import { useRemoveReceptionistCommand } from '../../../hooks/requests/receptionists';
import { ReceptionistsTableProps } from './ReceptionistsTable.interface';
import { NoReceptionistContainer, StyledReceptionistRow } from './ReceptionistsTable.styles';

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
                        <CustomCell>Full name</CustomCell>
                        <CustomCell>Phone number</CustomCell>
                        <CustomCell>Manage</CustomCell>
                    </>
                }
            >
                {receptionists.map((receptionist) => (
                    <StyledReceptionistRow key={receptionist.id} hover>
                        <CustomCell handleClick={() => handleRowClick(receptionist.id)}>{receptionist.fullName}</CustomCell>
                        <CustomCell handleClick={() => handleRowClick(receptionist.id)}>{receptionist.officeAddress}</CustomCell>
                        <CustomCell handleClick={() => setDeleteReceptionistId(receptionist.id)}>
                            <IconButton>
                                <DeleteForeverIcon fontSize='medium' />
                            </IconButton>
                        </CustomCell>
                    </StyledReceptionistRow>
                ))}
            </CustomTable>

            {receptionists.length === 0 ? (
                <NoReceptionistContainer>
                    <Typography>No receptionists</Typography>
                </NoReceptionistContainer>
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
                isOpen={!!deleteReceptionistId}
                title='Remove patient?'
                content='Do you really want to delete? Data will be lost.'
                handleSubmit={handleRemovePatient}
                handleDecline={() => setDeleteReceptionistId(null)}
            />

            {isLoading && <Loader />}
        </>
    );
};
