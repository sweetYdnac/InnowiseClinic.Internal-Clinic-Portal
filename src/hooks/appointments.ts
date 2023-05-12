import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UseFormSetError } from 'react-hook-form';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { AppointmentsService } from '../api/services/AppointmentsService';
import { AppRoutes } from '../constants/AppRoutes';
import { ApppointmentsQueries } from '../constants/queries';
import { ICreatedResponse, IPagedResponse } from '../types/common/Responses';
import { ICreateAppointmentRequest, IGetAppointmentsRequest, IGetTimeSlotsRequest } from '../types/request/appointments';
import { IAppointmentResponse, ITimeSlot } from '../types/response/appointments';
import { showPopup } from '../utils/functions';
import { ICreateAppointmentForm } from './validators/appointments/createAppointment';
import { IGetAppointmentsForm } from './validators/appointments/getAppointments';

export const usePagedAppointments = (
    request: IGetAppointmentsRequest,
    setError: UseFormSetError<IGetAppointmentsForm>,
    enabled = false
) => {
    const navigate = useNavigate();

    return useQuery<IPagedResponse<IAppointmentResponse>, AxiosError, IPagedResponse<IAppointmentResponse>, QueryKey>({
        queryKey: [ApppointmentsQueries.getAppointments, { ...request }],
        queryFn: async () => await AppointmentsService.getAppointments(request),
        enabled: enabled,
        retry: false,
        keepPreviousData: true,
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                showPopup('Something went wrong.');
            }
        },
    });
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

export const useCreateAppointmentCommand = (
    request: ICreateAppointmentRequest,
    navigate: NavigateFunction,
    setError: UseFormSetError<ICreateAppointmentForm>
) => {
    return useMutation<ICreatedResponse, AxiosError<any, any>, void>({
        mutationFn: async () => await AppointmentsService.create(request),
        onSuccess: () => {
            navigate(AppRoutes.Appointments);
            showPopup('Appointment created successfully!', 'success');
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('patientId', {
                    message:
                        error.response.data.errors?.PatientId?.[0] ||
                        error.response.data.errors?.PatientFullName?.[0] ||
                        error.response.data.errors?.PatientPhoneNumber?.[0] ||
                        error.response.data.errors?.PatientDateOfBirth?.[0] ||
                        error.response.data.Message ||
                        '',
                });

                setError('officeId', {
                    message:
                        error.response.data.errors?.OfficeId?.[0] ||
                        error.response.data.errors?.OfficeAddress?.[0] ||
                        error.response.data.Message ||
                        '',
                });
                setError('specializationId', {
                    message: error.response.data.errors?.DoctorSpecializationName?.[0] || error.response.data.Message || '',
                });
                setError('doctorId', {
                    message:
                        error.response.data.errors?.DoctorId?.[0] ||
                        error.response.data.errors?.DoctorFullName?.[0] ||
                        error.response.data.Message ||
                        '',
                });
                setError('serviceId', {
                    message:
                        error.response.data.errors?.ServiceId?.[0] ||
                        error.response.data.errors?.ServiceName?.[0] ||
                        error.response.data.errors?.Duration?.[0] ||
                        error.response.data.Message ||
                        '',
                });
                setError('date', {
                    message: error.response.data.errors?.Date?.[0] || error.response.data.Message || '',
                });
                setError('time', {
                    message: error.response.data.errors?.Time?.[0] || error.response.data.Message || '',
                });
            }
        },
        retry: false,
    });
};
