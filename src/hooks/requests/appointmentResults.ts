import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { dateApiFormat } from '../../constants/Formats';
import { ApppointmentResultsQueries } from '../../constants/QueryKeys';
import { AppRoutes } from '../../routes/AppRoutes';
import { ICreatedResponse, INoContentResponse } from '../../types/common/Responses';
import { ICreateAppointmentResultRequest, IUpdateAppointmentResultRequest } from '../../types/request/appointmentResults';
import { IAppointmentResultResponse } from '../../types/response/appointmentResults';
import { useAppointmentResultsService } from '../services/useAppointmentResultsService';
import { IAppointmentResultForm } from '../validators/appointmentResults/common';

export const useGetAppointmentResultById = (id: string) => {
    const appointmentResultsService = useAppointmentResultsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IAppointmentResultResponse, AxiosError, IAppointmentResultResponse, QueryKey>({
        queryKey: [ApppointmentResultsQueries.getById, id],
        queryFn: async () => await appointmentResultsService.getById(id),
        retry: false,
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                enqueueSnackbar('Something went wrong.', {
                    variant: 'error',
                });
            }
        },
    });
};

export const useCreateAppointmentResultCommand = (form: IAppointmentResultForm, setError: UseFormSetError<IAppointmentResultForm>) => {
    const appointmentResultsService = useAppointmentResultsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<ICreatedResponse, AxiosError<any, any>, void>({
        mutationFn: async () => {
            const { date, ...rest } = form;

            return await appointmentResultsService.create({
                ...rest,
                patientDateOfBirth: form.patientDateOfBirth.format(dateApiFormat),
            } as ICreateAppointmentResultRequest);
        },
        retry: false,
        onSuccess: (response) => {
            navigate(AppRoutes.AppointmentResult.replace(':id', response.id));
            enqueueSnackbar('Appointment result created successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('patientFullName', {
                    message: error.response.data.errors?.PatientFullName?.[0] || error.response.data.Message || '',
                });
                setError('patientDateOfBirth', {
                    message: error.response.data.errors?.PatientDateOfBirth?.[0] || error.response.data.Message || '',
                });
                setError('doctorFullName', {
                    message: error.response.data.errors?.DoctorFullName?.[0] || error.response.data.Message || '',
                });
                setError('doctorSpecializationName', {
                    message: error.response.data.errors?.DoctorSpecializationName?.[0] || error.response.data.Message || '',
                });
                setError('serviceName', {
                    message: error.response.data.errors?.ServiceName?.[0] || error.response.data.Message || '',
                });
                setError('complaints', {
                    message: error.response.data.errors?.Complaints?.[0] || error.response.data.Message || '',
                });
                setError('conclusion', {
                    message: error.response.data.errors?.Conclusion?.[0] || error.response.data.Message || '',
                });
                setError('recommendations', {
                    message: error.response.data.errors?.Recommendations?.[0] || error.response.data.Message || '',
                });

                if (error.response.data.errors?.AppointmentId?.[0]) {
                    navigate(AppRoutes.Home);
                    enqueueSnackbar('Something went wrong.', {
                        variant: 'error',
                    });
                }
            }
        },
    });
};

export const useUpdateAppointmentResultCommand = (
    id: string,
    form: IAppointmentResultForm,
    setError: UseFormSetError<IAppointmentResultForm>
) => {
    const appointmentResultsService = useAppointmentResultsService();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    return useMutation<INoContentResponse, AxiosError<any, any>, void>({
        mutationFn: async () =>
            await appointmentResultsService.update(id, {
                ...form,
                date: form.date.format(dateApiFormat),
                patientDateOfBirth: form.patientDateOfBirth.format(dateApiFormat),
            } as IUpdateAppointmentResultRequest),
        retry: false,
        onSuccess: (data) => {
            queryClient.setQueryData([ApppointmentResultsQueries.getById, id], {
                ...form,
                id: id,
                date: form.date.format(dateApiFormat),
                patientDateOfBirth: form.patientDateOfBirth.format(dateApiFormat),
            } as IAppointmentResultResponse);
            enqueueSnackbar('Appointment result updated successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('patientFullName', {
                    message: error.response.data.errors?.PatientFullName?.[0] || error.response.data.Message || '',
                });
                setError('patientDateOfBirth', {
                    message: error.response.data.errors?.PatientDateOfBirth?.[0] || error.response.data.Message || '',
                });
                setError('doctorFullName', {
                    message: error.response.data.errors?.DoctorFullName?.[0] || error.response.data.Message || '',
                });
                setError('doctorSpecializationName', {
                    message: error.response.data.errors?.DoctorSpecializationName?.[0] || error.response.data.Message || '',
                });
                setError('serviceName', {
                    message: error.response.data.errors?.ServiceName?.[0] || error.response.data.Message || '',
                });
                setError('date', {
                    message: error.response.data.errors?.Date?.[0] || error.response.data.Message || '',
                });
                setError('complaints', {
                    message: error.response.data.errors?.Complaints?.[0] || error.response.data.Message || '',
                });
                setError('conclusion', {
                    message: error.response.data.errors?.Conclusion?.[0] || error.response.data.Message || '',
                });
                setError('recommendations', {
                    message: error.response.data.errors?.Recommendations?.[0] || error.response.data.Message || '',
                });
            }
        },
    });
};
