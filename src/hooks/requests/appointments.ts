import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { ValidationError } from 'yup';
import { dateApiFormat, timeApiFormat } from '../../constants/Formats';
import { ApppointmentsQueries } from '../../constants/QueryKeys';
import { AppRoutes } from '../../routes/AppRoutes';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import {
    ICreateAppointmentRequest,
    IGetAppointmentsRequest,
    IGetPatientHistoryRequest,
    IGetTimeSlotsRequest,
    IRescheduleAppointmentRequest,
} from '../../types/request/appointments';
import {
    IAppointmentHistoryResponse,
    IAppointmentResponse,
    IRescheduleAppointmentResponse,
    ITimeSlot,
} from '../../types/response/appointments';
import { useAppointmentsService } from '../services/useAppointmentsService';
import { ICreateAppointmentForm } from '../validators/appointments/create';
import { useGetTimeSlotsValidator } from '../validators/appointments/getTimeSlots';
import { IPatientHistoryForm } from '../validators/appointments/patientHistory';
import { IRescheduleAppointmentForm } from '../validators/appointments/reschedule';

export const useAppointmentQuery = (id: string, enabled = false) => {
    const appointmentsService = useAppointmentsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IRescheduleAppointmentResponse, AxiosError, IRescheduleAppointmentResponse, QueryKey>({
        queryKey: [ApppointmentsQueries.getById, id],
        queryFn: async () => await appointmentsService.getById(id),
        enabled: enabled,
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

export const usePagedAppointmentsQuery = (request: IGetAppointmentsRequest, enabled = false) => {
    const appointmentsService = useAppointmentsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IPagedResponse<IAppointmentResponse>, AxiosError, IPagedResponse<IAppointmentResponse>, QueryKey>({
        queryKey: [ApppointmentsQueries.getPaged, { ...request }],
        queryFn: async () => await appointmentsService.getPaged(request),
        enabled: enabled,
        retry: false,
        keepPreviousData: true,
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

export const useTimeSlotsQuery = (queryString: IGetTimeSlotsRequest, enabled = false) => {
    const appointmentsService = useAppointmentsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { validationScheme } = useGetTimeSlotsValidator();

    return useQuery<ITimeSlot[] | void, AxiosError, ITimeSlot[], QueryKey>({
        queryKey: [ApppointmentsQueries.getTimeSlots, { ...queryString }],
        queryFn: async () => {
            try {
                await validationScheme.validate(queryString);

                return (await appointmentsService.getTimeSlots(queryString)).timeSlots;
            } catch (error) {
                if (error instanceof ValidationError) {
                    navigate(AppRoutes.Home);
                    enqueueSnackbar('Something went wrong.', {
                        variant: 'error',
                    });
                }
            }
        },
        enabled: enabled,
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

export const useGetPatientHistoryQuery = (patientId: string, form: IPatientHistoryForm, enabled = false) => {
    const appointmentsService = useAppointmentsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IPagedResponse<IAppointmentHistoryResponse>, AxiosError, IPagedResponse<IAppointmentHistoryResponse>, QueryKey>({
        queryKey: [ApppointmentsQueries.getPatientHistory, patientId],
        queryFn: async () => await appointmentsService.getPatientHistory(patientId, { ...form } as IGetPatientHistoryRequest),
        enabled: enabled,
        retry: false,
        keepPreviousData: true,
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

export const useCreateAppointmentCommand = (
    request: ICreateAppointmentRequest,
    navigate: NavigateFunction,
    setError: UseFormSetError<ICreateAppointmentForm>
) => {
    const appointmentsService = useAppointmentsService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<ICreatedResponse, AxiosError<any, any>, void>({
        mutationFn: async () => await appointmentsService.create(request),
        retry: false,
        onSuccess: (response) => {
            queryClient.setQueryData([ApppointmentsQueries.getById, response.id], request as IRescheduleAppointmentResponse);
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryName = query.queryKey[0];
                    const queryString = query.queryKey[1] as IGetAppointmentsRequest;

                    return (
                        queryName === ApppointmentsQueries.getPaged && queryString.date === request.date && queryString.isApproved !== true
                    );
                },
            });
            navigate(AppRoutes.Appointments);
            enqueueSnackbar('Appointment created successfully!', {
                variant: 'success',
            });
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
    });
};

export const useRescheduleAppointmentCommand = (
    id: string,
    form: IRescheduleAppointmentForm,
    oldDate: dayjs.Dayjs | null,
    setError: UseFormSetError<IRescheduleAppointmentForm>
) => {
    const appointmentsService = useAppointmentsService();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const request = useMemo(() => {
        return {
            doctorId: form.doctorId,
            doctorFullName: form.doctorInput,
            date: form.date?.format(dateApiFormat),
            time: form.time?.format(timeApiFormat),
        } as IRescheduleAppointmentRequest;
    }, [form.date, form.doctorId, form.doctorInput, form.time]);

    return useMutation<INoContentResponse, AxiosError<any, any>, void>({
        mutationFn: async () => await appointmentsService.reschedule(id, request),
        retry: false,
        onSuccess: () => {
            queryClient.setQueryData<IRescheduleAppointmentResponse>(
                [ApppointmentsQueries.getById, id],
                (oldData) =>
                    ({
                        ...oldData,
                        ...request,
                    } as IRescheduleAppointmentResponse)
            );
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryName = query.queryKey[0];
                    const queryString = query.queryKey[1] as IGetAppointmentsRequest;

                    return (
                        queryName === ApppointmentsQueries.getPaged &&
                        (queryString.date === request.date || queryString.date === oldDate?.format(dateApiFormat)) &&
                        queryString.isApproved !== true
                    );
                },
            });
            navigate(AppRoutes.Appointments);
            enqueueSnackbar('Appointment rescheduled successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('doctorId', {
                    message:
                        error.response.data.errors?.DoctorId?.[0] ||
                        error.response.data.errors?.DoctorFullName?.[0] ||
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
    });
};

export const useApproveAppointmentCommand = (date: dayjs.Dayjs) => {
    const appointmentsService = useAppointmentsService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<INoContentResponse, AxiosError<any, any>, { id: string }>({
        mutationFn: async ({ id }) => await appointmentsService.approve(id),
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.removeQueries([ApppointmentsQueries.getById, variables.id]);
            queryClient.setQueriesData<IPagedResponse<IAppointmentResponse>>(
                [ApppointmentsQueries.getPaged, { date: date.format(dateApiFormat) }],
                (prev) => {
                    return {
                        ...prev,
                        items: prev?.items.map((item) => {
                            if (item.id === variables.id) {
                                return {
                                    ...item,
                                    isApproved: true,
                                };
                            }
                            return item;
                        }),
                    } as IPagedResponse<IAppointmentResponse>;
                }
            );
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryName = query.queryKey[0];
                    const queryString = query.queryKey[1] as IGetAppointmentsRequest;

                    return (
                        queryName === ApppointmentsQueries.getPaged &&
                        queryString.date === date.format(dateApiFormat) &&
                        queryString.isApproved !== null
                    );
                },
            });
            enqueueSnackbar('Appointment approved successfully!', {
                variant: 'success',
            });
        },
        onError: () => {
            enqueueSnackbar('Something went wrong.', {
                variant: 'error',
            });
        },
    });
};

export const useCancelAppointmentCommand = (id: string, date: dayjs.Dayjs) => {
    const appointmentsService = useAppointmentsService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const cancelAppointmentId = useMemo(() => id, [id]);

    return useMutation<INoContentResponse, AxiosError<any, any>, { id: string }>({
        mutationFn: async () => await appointmentsService.cancel(cancelAppointmentId as string),
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === ApppointmentsQueries.getPaged &&
                    (query.queryKey[1] as IGetAppointmentsRequest).date === date.format(dateApiFormat),
            });
            queryClient.removeQueries([ApppointmentsQueries.getById, variables.id]);
            enqueueSnackbar('Appointment canceled successfully!', {
                variant: 'success',
            });
        },
        onError: () => {
            enqueueSnackbar('Something went wrong.', {
                variant: 'error',
            });
        },
    });
};
