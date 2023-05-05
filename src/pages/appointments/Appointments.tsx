import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppointmentsService from '../../api/services/AppointmentsService';
import AutoComplete from '../../components/AutoComplete/AutoComplete';
import FilterTextfield from '../../components/FilterTextfield/FilterTextfield';
import Loader from '../../components/Loader/Loader';
import { dateApiFormat } from '../../constants/formats';
import { usePagedServices } from '../../hooks/services/services';
import { useAppSelector } from '../../hooks/store';
import { selectProfile } from '../../store/profileSlice';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { IPagedResponse, IPagingData } from '../../types/common/Responses';
import { IGetAppointmentsRequest } from '../../types/request/AppointmentsAPI_requests';
import { IAppointmentResponse } from '../../types/response/AppointmentsAPI_responses';
import { GET_APPOINTMENTS_VALIDATOR, IGetAppointmentsForm, initialValues } from '../../validators/appointmentsAPI/GetAppointments';

interface AppointmentsProps {}

const Appointments: FunctionComponent<AppointmentsProps> = () => {
    const profile = useAppSelector(selectProfile);
    const [paging, setPaging] = useState({
        offices: {
            currentPage: 1,
            pageSize: 50,
        } as IPagingData,
        services: {
            currentPage: 1,
            pageSize: 50,
        } as IPagingData,
    });

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, touchedFields, defaultValues },
        getValues,
        watch,
    } = useForm<IGetAppointmentsForm>({
        mode: 'onBlur',
        resolver: yupResolver(GET_APPOINTMENTS_VALIDATOR),
        defaultValues: initialValues,
    });

    // const {
    //     data: appointments,
    //     refetch: fetchAppointments,
    //     isFetching: isFetchingAppointments,
    // } = useQuery<any, Error, IPagedResponse<IAppointmentResponse>>({
    //     queryKey: ['getAppointments', getValues()],
    //     queryFn: async () => {
    //         const request: IGetAppointmentsRequest = {
    //             ...getValues(),
    //             serviceId: getValues('service').id,
    //             date: dayjs(getValues().date).format(dateApiFormat),
    //         };

    //         return await AppointmentsService.getAppointments(request);
    //     },
    //     enabled: false,
    //     retry: false,
    //     keepPreviousData: true,
    // });

    // const {
    //     data: offices,
    //     refetch: fetchOffices,
    //     isFetching: isFetchingOffices,
    // } = useQuery<any, Error, IOfficeInformationResponse[]>({
    //     initialData: [] as IOfficeInformationResponse[],
    //     queryKey: ['getOffices', paging.offices.currentPage, paging.offices.pageSize],
    //     queryFn: async () => {
    //         const { currentPage, pageSize } = paging.offices;

    //         const request = {
    //             currentPage: currentPage,
    //             pageSize: pageSize,
    //         } as IGetPagedOfficesRequest;

    //         const { items, ...pagingData } = await OfficesService.getPaged(request);

    //         setPaging({
    //             ...paging,
    //             offices: pagingData,
    //         });

    //         return items;
    //     },
    //     enabled: false,
    //     retry: false,
    //     keepPreviousData: true,
    // });

    // const {
    //     data: services,
    //     refetch: fetchServices,
    //     isFetching: isFetchingServices,
    // } = useQuery<IServiceInformationResponse[], Error, IServiceInformationResponse[], QueryKey>({
    //     initialData: [] as IServiceInformationResponse[],
    //     queryKey: ['getServices', { currentPage: paging.services.currentPage, pageSize: paging.services.pageSize }],
    //     queryFn: async (obj) => {
    //         console.log(obj.queryKey[1]);
    //         const { currentPage, pageSize } = paging.services;

    //         const request = {
    //             currentPage: currentPage,
    //             pageSize: pageSize,
    //         } as IGetPagedServicesRequest;

    //         const { items, ...pagingData } = await ServicesService.getPaged(request);

    //         setPaging({
    //             ...paging,
    //             services: pagingData,
    //         });

    //         return items;
    //     },
    //     enabled: false,
    //     retry: false,
    //     keepPreviousData: true,
    // });

    const serviceInput = watch('service.input');
    console.log(watch('service'));
    const { data: services, isFetching: isFetchingServices } = usePagedServices(serviceInput);

    return (
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* <Box component={'form'} onSubmit={handleSubmit(() => fetchAppointments())} sx={{ display: 'flex', flexDirection: 'column' }}> */}
            <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column' }}>
                <FilterTextfield id={register('doctorFullName').name} control={control} displayName='Doctor' />
                {/* <AutoComplete
                    id={register('officeId').name}
                    displayName='Office'
                    control={control}
                    options={offices.map((item) => {
                        return {
                            label: item.address,
                            id: item.id,
                        } as IAutoCompleteItem;
                    })}
                    handleOpen={fetchOffices}
                /> */}
                <AutoComplete
                    id={register('service').name}
                    displayName='Service'
                    control={control}
                    options={
                        services?.map((item) => {
                            return {
                                label: item.title,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    // handleOpen={fetchServices}
                    // handleInputChange={() => fetchServices('123')}
                />
                <Button type='submit'>Generate</Button>
            </Box>
            {/* <Box>{appointments && <>loaded data</>}</Box> */}
            {/* {(isFetchingAppointments || isFetchingOffices || isFetchingServices) && <Loader />} */}
            {isFetchingServices && <Loader />}
        </Box>
    );
};

export default Appointments;
