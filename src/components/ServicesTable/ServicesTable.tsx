import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { IconButton, TableCell, TablePagination } from '@mui/material';
import { FunctionComponent, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modals } from '../../constants/Modals';
import { useChangeServiceStatusCommand } from '../../hooks/requests/services';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { IServiceForm } from '../../hooks/validators/services/create&update';
import { openModal } from '../../store/modalsSlice';
import { clearServices, removeService, selectServices } from '../../store/servicesSlice';
import { ToCurrency } from '../../utils/currencyFormatter';
import { Loader } from '../Loader/Loader';
import { CustomCell, CustomTable } from '../Table';
import { ToggleSwitch } from '../UI/ToggleSwitch';
import { ServicesTableProps } from './ServicesTable.interface';
import { AddServiceRow, StyledExistingServiceRow, StyledNewServiceRow } from './ServicesTable.styles';

export const ServicesTable: FunctionComponent<ServicesTableProps> = ({
    existedServices,
    pagingData,
    handlePageChange,
    workMode = 'view',
}) => {
    const { id } = useParams();
    const { mutate, isLoading } = useChangeServiceStatusCommand(id as string);
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
            <CustomTable
                header={
                    <>
                        <CustomCell>Title</CustomCell>
                        <CustomCell>Price</CustomCell>
                        <CustomCell>Category</CustomCell>
                        <CustomCell>Status</CustomCell>
                        <CustomCell>Manage</CustomCell>
                    </>
                }
            >
                {workMode === 'edit' && (
                    <AddServiceRow hover>
                        <TableCell colSpan={6} align='center' onClick={() => handleOpenCreateServiceModal()}>
                            Add Service
                            <IconButton>
                                <AddBoxIcon fontSize='medium' />
                            </IconButton>
                        </TableCell>
                    </AddServiceRow>
                )}
                {newServices.map((service) => (
                    <StyledNewServiceRow key={`${service.title}${service.categoryId}`}>
                        <CustomCell>{service.title}</CustomCell>
                        <CustomCell>{ToCurrency(service.price)}</CustomCell>
                        <CustomCell>{service.categoryInput}</CustomCell>
                        <CustomCell>
                            <ToggleSwitch disabled={true} value={service.isActive} />
                        </CustomCell>
                        <CustomCell handleClick={() => handleRemoveService(service)}>
                            <IconButton>
                                <DeleteForeverIcon fontSize='medium' />
                            </IconButton>
                        </CustomCell>
                    </StyledNewServiceRow>
                ))}
                {existedServices &&
                    existedServices.map((service) => (
                        <StyledExistingServiceRow key={service.id} hover>
                            <CustomCell handleClick={() => handleOpenServiceInformationModal(service.id)}>{service.title}</CustomCell>
                            <CustomCell handleClick={() => handleOpenServiceInformationModal(service.id)}>
                                {ToCurrency(service.price)}
                            </CustomCell>
                            <CustomCell handleClick={() => handleOpenServiceInformationModal(service.id)}>
                                {service.categoryTitle}
                            </CustomCell>
                            <CustomCell>
                                <ToggleSwitch
                                    value={service.isActive}
                                    handleChange={(value) => mutate({ id: service.id, isActive: value })}
                                />
                            </CustomCell>
                            <CustomCell>
                                <IconButton onClick={() => handleOpenEditServiceModal(service.id)}>
                                    <ModeEditIcon fontSize='medium' />
                                </IconButton>
                            </CustomCell>
                        </StyledExistingServiceRow>
                    ))}
            </CustomTable>

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
