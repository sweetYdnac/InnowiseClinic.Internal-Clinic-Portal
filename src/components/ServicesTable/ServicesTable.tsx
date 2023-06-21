import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { IconButton } from '@mui/material';
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
import { CustomTable, StyledCell } from '../Table';
import { Pagination } from '../Table/Pagination/Pagination';
import { ToggleSwitch } from '../UI/ToggleSwitch';
import { ServicesTableProps } from './ServicesTable.interface';
import { AddServiceRow, StyledExistingServiceRow, StyledNewServiceRow } from './ServicesTable.styles';
import { ServiceTableHeader } from './data/serviceTableHeader';

export const ServicesTable: FunctionComponent<ServicesTableProps> = ({
    existedServices,
    pagingData,
    handlePageChange,
    workMode = 'view',
}) => {
    const { id } = useParams();
    const { mutate: changeStatus, isLoading } = useChangeServiceStatusCommand(id as string);
    const dispatch = useAppDispatch();
    const newServices = useAppSelector(selectServices);

    const handleOpenServiceInformationModal = useCallback(
        (id: string) => () => dispatch(openModal({ name: Modals.Service, id: id, workMode: 'view' })),
        [dispatch]
    );
    const handleOpenEditServiceModal = useCallback(
        (id: string) => () => dispatch(openModal({ name: Modals.Service, id: id, workMode: 'edit' })),
        [dispatch]
    );
    const handleRemoveService = useCallback((service: IServiceForm) => () => dispatch(removeService(service)), [dispatch]);
    const handleOpenCreateServiceModal = useCallback(() => dispatch(openModal({ name: Modals.CreateService })), [dispatch]);

    useEffect(
        () => () => {
            dispatch(clearServices());
        },
        [dispatch]
    );

    return (
        <>
            <CustomTable
                header={
                    <>
                        {ServiceTableHeader.map((item) => (
                            <StyledCell key={item}>{item}</StyledCell>
                        ))}
                    </>
                }
            >
                {workMode === 'edit' && (
                    <AddServiceRow hover>
                        <StyledCell colSpan={6} onClick={handleOpenCreateServiceModal}>
                            Add Service
                            <IconButton>
                                <AddBoxIcon fontSize='medium' />
                            </IconButton>
                        </StyledCell>
                    </AddServiceRow>
                )}
                {newServices.map((service) => (
                    <StyledNewServiceRow key={`${service.title}${service.categoryId}`}>
                        <StyledCell>{service.title}</StyledCell>
                        <StyledCell>{ToCurrency(service.price)}</StyledCell>
                        <StyledCell>{service.categoryInput}</StyledCell>
                        <StyledCell>
                            <ToggleSwitch disabled={true} value={service.isActive} />
                        </StyledCell>
                        <StyledCell onClick={handleRemoveService(service)}>
                            <IconButton>
                                <DeleteForeverIcon fontSize='medium' />
                            </IconButton>
                        </StyledCell>
                    </StyledNewServiceRow>
                ))}
                {existedServices &&
                    existedServices.map((service) => (
                        <StyledExistingServiceRow key={service.id} hover>
                            <StyledCell onClick={handleOpenServiceInformationModal(service.id)}>{service.title}</StyledCell>
                            <StyledCell onClick={handleOpenServiceInformationModal(service.id)}>{ToCurrency(service.price)}</StyledCell>
                            <StyledCell onClick={handleOpenServiceInformationModal(service.id)}>{service.categoryTitle}</StyledCell>
                            <StyledCell>
                                <ToggleSwitch
                                    value={service.isActive}
                                    handleChange={(_, value) => changeStatus({ id: service.id, isActive: value })}
                                />
                            </StyledCell>
                            <StyledCell>
                                <IconButton onClick={handleOpenEditServiceModal(service.id)}>
                                    <ModeEditIcon fontSize='medium' />
                                </IconButton>
                            </StyledCell>
                        </StyledExistingServiceRow>
                    ))}
            </CustomTable>

            <Pagination pagingData={pagingData} handlePageChange={handlePageChange} />

            {isLoading && <Loader />}
        </>
    );
};
