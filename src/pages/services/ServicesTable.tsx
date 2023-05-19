import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {
    Divider,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { ToggleSwitch } from '../../components/Switch/ToggleSwitch';
import { WorkMode } from '../../constants/WorkModes';
import { useChangeServiceStatusCommand } from '../../hooks/requests/services';
import { IServiceForm } from '../../hooks/validators/services/create&update';
import { AppRoutes } from '../../routes/AppRoutes';
import { IPagingData } from '../../types/common/Responses';
import { IServiceInformationResponse } from '../../types/response/services';
import { ToCurrency } from '../../utils/currencyFormatter';

interface ServicesTableProps {
    existedServices: IServiceInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
    workMode?: WorkMode;
    newServices?: IServiceForm[];
}

export const ServicesTable: FunctionComponent<ServicesTableProps> = ({
    existedServices,
    pagingData,
    handlePageChange,
    workMode = 'view',
    newServices = [],
}) => {
    const navigate = useNavigate();
    const { mutate, isLoading } = useChangeServiceStatusCommand();

    const handleRowClick = useCallback((id: string) => navigate(AppRoutes.ServiceInformation.replace(':id', `${id}`)), [navigate]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Title</TableCell>
                            <TableCell align='center'>Price</TableCell>
                            <TableCell align='center'>Category</TableCell>
                            <TableCell align='center'>Status</TableCell>
                            <TableCell align='center'>Edit</TableCell>
                            {workMode === 'edit' && <TableCell align='center'>Remove</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workMode === 'edit' && (
                            <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell colSpan={6} align='center'>
                                    Add Service
                                    <IconButton>
                                        <AddBoxIcon fontSize='medium' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                        {newServices.map((service) => (
                            <TableRow
                                key={`${service.title}${service.categoryId}`}
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align='center'>{service.title}</TableCell>
                                <TableCell align='center'>{ToCurrency(service.price)}</TableCell>
                                <TableCell align='center'>{service.categoryInput}</TableCell>
                                <TableCell align='center'>
                                    <ToggleSwitch disabled={true} value={service.isActive} />
                                </TableCell>
                                <TableCell align='center'>
                                    <IconButton>
                                        <ModeEditIcon fontSize='medium' />
                                        {/* edit service modal */}
                                    </IconButton>
                                </TableCell>
                                {workMode === 'edit' && (
                                    <TableCell align='center'>
                                        <IconButton>
                                            <DeleteForeverIcon fontSize='medium' />
                                            {/* remove new added service */}
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        <Divider variant='middle' />
                        {existedServices.map((service) => (
                            <TableRow key={service.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}>
                                <TableCell onClick={() => handleRowClick(service.id)} align='center'>
                                    {service.title}
                                </TableCell>
                                <TableCell onClick={() => handleRowClick(service.id)} align='center'>
                                    {ToCurrency(service.price)}
                                </TableCell>
                                <TableCell onClick={() => handleRowClick(service.id)} align='center'>
                                    {service.categoryTitle}
                                </TableCell>
                                <TableCell align='center'>
                                    <ToggleSwitch
                                        value={service.isActive}
                                        handleChange={(value) => mutate({ id: service.id, isActive: value })}
                                    />
                                </TableCell>
                                <TableCell align='center'>
                                    <IconButton>
                                        <ModeEditIcon fontSize='medium' />
                                        {/* edit service modal */}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
