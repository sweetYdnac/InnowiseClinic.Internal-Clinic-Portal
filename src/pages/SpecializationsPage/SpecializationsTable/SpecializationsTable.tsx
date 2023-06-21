import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { CustomTable, Pagination, StyledCell } from '../../../components/Table';
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
                            <StyledCell key={title}>{title}</StyledCell>
                        ))}
                    </>
                }
            >
                {specializations.map((item) => (
                    <StyledSpecializationRow key={item.id} hover>
                        <StyledCell onClick={() => handleRowClick(item.id)}>{item.title}</StyledCell>
                        <StyledCell>
                            <ToggleSwitch value={item.isActive} handleChange={(_, value) => mutate({ id: item.id, isActive: value })} />
                        </StyledCell>
                    </StyledSpecializationRow>
                ))}
            </CustomTable>

            <Pagination pagingData={pagingData} handlePageChange={handlePageChange} />

            {isLoading && <Loader />}
        </>
    );
};
