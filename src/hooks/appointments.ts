import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AppointmentsService from '../api/services/AppointmentsService';
import { dateApiFormat } from '../constants/formats';
import { ApppointmentsQueries } from '../constants/queries';
import { IPagingData } from '../types/common/Responses';
import { AppRoutes } from '../constants/AppRoutes';
import { IGetAppointmentsRequest } from '../types/request/AppointmentsAPI_requests';
import { IAppointmentResponse } from '../types/response/AppointmentsAPI_responses';
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
        officeId: values.office.id,
        serviceId: values.service.id,
        isApproved: values.isApproved,
    };

    const query = useQuery<IAppointmentResponse[], Error, IAppointmentResponse[], QueryKey>({
        queryKey: [ApppointmentsQueries.getAppointments, request],
        queryFn: async () => {
            const { items, ...paging } = await AppointmentsService.getAppointments(request);
            setPagingData(paging as IPagingData);

            return items;
        },
        enabled: false,
        retry: false,
        keepPreviousData: true,
        onError: (error: Error) => {
            if (error instanceof AxiosError) {
                setError('date', {
                    message: error?.response?.data.errors?.Date?.[0] || error?.response?.data.Message || '',
                });
            } else {
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
