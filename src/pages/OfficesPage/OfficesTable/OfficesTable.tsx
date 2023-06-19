import { TablePagination, Typography } from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { CustomCell, CustomTable } from '../../../components/Table';
import { ToggleSwitch } from '../../../components/UI/ToggleSwitch';
import { AppRoutes } from '../../../constants/AppRoutes';
import { useChangeOfficeStatusCommand } from '../../../hooks/requests/offices';
import { OfficesTableProps } from './OfficesTable.interface';
import { NoOfficesContainer, StyledOfficeRow } from './OfficesTable.styles';

export const OfficesTable: FunctionComponent<OfficesTableProps> = ({ offices, pagingData, handlePageChange }) => {
    const navigate = useNavigate();
    const { mutate, isLoading } = useChangeOfficeStatusCommand();

    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.OfficeInformation.replace(':id', `${id}`)), [navigate]);

    return (
        <>
            <CustomTable
                header={
                    <>
                        <CustomCell>Address</CustomCell>
                        <CustomCell>Status</CustomCell>
                        <CustomCell>Phone number</CustomCell>
                    </>
                }
            >
                {offices.map((office) => (
                    <StyledOfficeRow key={office.id} hover>
                        <CustomCell handleClick={() => handleRowClick(office.id)}>{office.address}</CustomCell>
                        <CustomCell>
                            <ToggleSwitch value={office.isActive} handleChange={(value) => mutate({ id: office.id, isActive: value })} />
                        </CustomCell>
                        <CustomCell handleClick={() => handleRowClick(office.id)}>{office.registryPhoneNumber}</CustomCell>
                    </StyledOfficeRow>
                ))}
            </CustomTable>

            {offices.length === 0 ? (
                <NoOfficesContainer>
                    <Typography>No Offices</Typography>
                </NoOfficesContainer>
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
