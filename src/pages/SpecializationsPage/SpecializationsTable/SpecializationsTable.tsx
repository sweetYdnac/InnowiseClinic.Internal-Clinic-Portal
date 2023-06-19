import { TablePagination } from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { CustomCell, CustomTable } from '../../../components/Table';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch';
import { AppRoutes } from '../../../constants/AppRoutes';
import { useChangeSpecializationStatusCommand } from '../../../hooks/requests/specializations';
import { SpecializationsTableProps } from './SpecializationsTable.interface';
import { StyledSpecializationRow } from './SpecializationsTable.styles';
import { SpecializationsTableHeader } from './data/specializationsTableHeader';

export const SpecializationsTable: FunctionComponent<SpecializationsTableProps> = ({ specializations, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const { mutate, isLoading } = useChangeSpecializationStatusCommand();
    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.SpecializationInformation.replace(':id', `${id}`)), [navigate]);

    return (
        <>
            <CustomTable
                header={
                    <>
                        {SpecializationsTableHeader.map((title) => (
                            <CustomCell key={title}>{title}</CustomCell>
                        ))}
                    </>
                }
            >
                {specializations.map((item) => (
                    <StyledSpecializationRow key={item.id} hover>
                        <CustomCell handleClick={() => handleRowClick(item.id)}>{item.title}</CustomCell>
                        <CustomCell>
                            <ToggleSwitch value={item.isActive} handleChange={(value) => mutate({ id: item.id, isActive: value })} />
                        </CustomCell>
                    </StyledSpecializationRow>
                ))}
            </CustomTable>

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
