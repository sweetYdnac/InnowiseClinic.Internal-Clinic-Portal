import { Typography } from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { CustomTable, Pagination, StyledCell } from '../../../components/Table';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch';
import { AppRoutes } from '../../../constants/AppRoutes';
import { useChangeOfficeStatusCommand } from '../../../hooks/requests/offices';
import { OfficesTableProps } from './OfficesTable.interface';
import { NoOfficesContainer, StyledOfficeRow } from './OfficesTable.styles';
import { OfficesTableHeader } from './data/officesTableHeader';

export const OfficesTable: FunctionComponent<OfficesTableProps> = ({ offices, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const { mutate, isLoading } = useChangeOfficeStatusCommand();

    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.OfficeInformation.replace(':id', `${id}`)), [navigate]);

    return (
        <>
            <CustomTable
                header={
                    <>
                        {OfficesTableHeader.map((title) => (
                            <StyledCell key={title}>{title}</StyledCell>
                        ))}
                    </>
                }
            >
                {offices.map((office) => (
                    <StyledOfficeRow key={office.id} hover>
                        <StyledCell onClick={() => handleRowClick(office.id)}>{office.address}</StyledCell>
                        <StyledCell>
                            <ToggleSwitch value={office.isActive} handleChange={(_, value) => mutate({ id: office.id, isActive: value })} />
                        </StyledCell>
                        <StyledCell onClick={() => handleRowClick(office.id)}>{office.registryPhoneNumber}</StyledCell>
                    </StyledOfficeRow>
                ))}
            </CustomTable>

            {offices.length === 0 ? (
                <NoOfficesContainer>
                    <Typography>No Offices</Typography>
                </NoOfficesContainer>
            ) : (
                <Pagination pagingData={pagingData} handlePageChange={handlePageChange} />
            )}

            {isLoading && <Loader />}
        </>
    );
};
