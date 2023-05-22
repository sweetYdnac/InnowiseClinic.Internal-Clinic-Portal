import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { FunctionComponent, useCallback, useEffect } from 'react';
import { Loader } from '../../components/Loader/Loader';
import { ToggleSwitch } from '../../components/Switch/ToggleSwitch';
import { Modals } from '../../constants/Modals';
import { WorkMode } from '../../constants/WorkModes';
import { useChangeServiceStatusCommand } from '../../hooks/requests/services';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { IServiceForm } from '../../hooks/validators/services/create&update';
import { openModal } from '../../store/modalsSlice';
import { clearServices, removeService, selectServices } from '../../store/servicesSlice';
import { IPagingData } from '../../types/common/Responses';
import { IServiceInformationResponse } from '../../types/response/services';
import { ToCurrency } from '../../utils/currencyFormatter';

interface ServicesTableProps {
    existedServices: IServiceInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
    workMode?: WorkMode;
}

export const ServicesTable: FunctionComponent<ServicesTableProps> = ({
    existedServices,
    pagingData,
    handlePageChange,
    workMode = 'view',
}) => {
    const { mutate, isLoading } = useChangeServiceStatusCommand();
    const dispatch = useAppDispatch();
    const newServices = useAppSelector(selectServices);

    const handleOpenServiceInformationModal = useCallback(
        (id: string) => dispatch(openModal({ name: Modals.Service, id: id, workMode: 'view' })),
        [dispatch]
    );
    const handleOpenEditServiceModal = useCallback(
        (id: string) => dispatch(openModal({ name: Modals.Service, id: id, workMode: 'edit' })),
        [dispatch]
    );
    const handleRemoveService = useCallback((service: IServiceForm) => dispatch(removeService(service)), [dispatch]);
    const handleOpenCreateServiceModal = useCallback(() => {
        dispatch(openModal({ name: Modals.CreateService }));
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearServices());
        };
    }, [dispatch]);

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
                            <TableCell align='center'>Manage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workMode === 'edit' && (
                            <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}>
                                <TableCell colSpan={6} align='center' onClick={() => handleOpenCreateServiceModal()}>
                                    Add Service
                                    <IconButton>
                                        <AddBoxIcon fontSize='medium' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                        {newServices.map((service) => (
                            <TableRow key={`${service.title}${service.categoryId}`} sx={{ backgroundColor: 'lightgreen' }}>
                                <TableCell align='center'>{service.title}</TableCell>
                                <TableCell align='center'>{ToCurrency(service.price)}</TableCell>
                                <TableCell align='center'>{service.categoryInput}</TableCell>
                                <TableCell align='center'>
                                    <ToggleSwitch disabled={true} value={service.isActive} />
                                </TableCell>
                                <TableCell align='center' onClick={() => handleRemoveService(service)}>
                                    <IconButton>
                                        <DeleteForeverIcon fontSize='medium' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {existedServices.map((service) => (
                            <TableRow
                                key={service.id}
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', backgroundColor: 'lightgrey' }}
                            >
                                <TableCell onClick={() => handleOpenServiceInformationModal(service.id)} align='center'>
                                    {service.title}
                                </TableCell>
                                <TableCell onClick={() => handleOpenServiceInformationModal(service.id)} align='center'>
                                    {ToCurrency(service.price)}
                                </TableCell>
                                <TableCell onClick={() => handleOpenServiceInformationModal(service.id)} align='center'>
                                    {service.categoryTitle}
                                </TableCell>
                                <TableCell align='center'>
                                    <ToggleSwitch
                                        value={service.isActive}
                                        handleChange={(value) => mutate({ id: service.id, isActive: value })}
                                    />
                                </TableCell>
                                <TableCell align='center'>
                                    <IconButton onClick={() => handleOpenEditServiceModal(service.id)}>
                                        <ModeEditIcon fontSize='medium' />
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
                sx={{ alignSelf: 'end' }}
            />

            {isLoading && <Loader />}
        </>
    );
};
