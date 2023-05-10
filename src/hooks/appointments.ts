import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AppointmentsService from '../api/services/AppointmentsService';
import { AppRoutes } from '../constants/AppRoutes';
import { dateApiFormat } from '../constants/formats';
import { ApppointmentsQueries } from '../constants/queries';
import { IPagingData } from '../types/common/Responses';
import { IGetAppointmentsRequest, IGetTimeSlotsRequest } from '../types/request/appointments';
import { IAppointmentResponse, ITimeSlot } from '../types/response/appointments';
import { showPopup } from '../utils/functions';
import { IGetAppointmentsForm } from '../validators/appointmentsAPI/GetAppointments';

export const usePagedAppointments = (
    initialPagingData: IPagingData,
    values: IGetAppointmentsForm,
    setError: UseFormSetError<IGetAppointmentsForm>
) => {
    const navigate = useNavigate();
    const [pagingData, setPagingData] = useState(initialPagingData);

    const request: IGetAppointmentsRequest = {
        currentPage: pagingData.currentPage,
        pageSize: pagingData.pageSize,
        date: dayjs(values.date).format(dateApiFormat),
        doctorFullName: values.doctorFullName,
        officeId: values.office.id ?? '',
        serviceId: values.service.id ?? '',
        isApproved: values.isApproved,
    };

    const query = useQuery<IAppointmentResponse[], AxiosError, IAppointmentResponse[], QueryKey>({
        queryKey: [ApppointmentsQueries.getAppointments, request],
        queryFn: async () => {
            const { items, ...paging } = await AppointmentsService.getAppointments(request);
            setPagingData(paging as IPagingData);

            return items;
        },
        enabled: false,
        retry: false,
        keepPreviousData: true,
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                showPopup('Something went wrong.');
            }
        },
    });

    return {
        pagingData,
        setPagingData,
        ...query,
    };
};

export const useTimeSlots = (queryString: IGetTimeSlotsRequest, enabled = false) => {
    const navigate = useNavigate();

    return useQuery<ITimeSlot[], AxiosError, ITimeSlot[], QueryKey>({
        queryKey: [ApppointmentsQueries.getTimeSlots, { ...queryString }],
        queryFn: async () => (await AppointmentsService.getTimeSlots(queryString)).timeSlots,
        enabled: enabled,
        retry: false,
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                showPopup('Something went wrong.');
            }
        },
    });
};
