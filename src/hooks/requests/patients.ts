import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { dateApiFormat } from '../../constants/Formats';
import { PatientsQueries } from '../../constants/QueryKeys';
import { AppRoutes } from '../../routes/AppRoutes';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { ICreatePatientRequest, IUpdatePatientRequest } from '../../types/request/patients';
import { IPatientInformationResponse, IPatientResponse } from '../../types/response/patients';
import { usePatientsService } from '../services/usePatientsService';
import { IPatientForm } from '../validators/patients/create&update';
import { IGetPatientsForm } from '../validators/patients/getPaged';

export const useGetPatientByIdQuery = (id: string, enabled = false) => {
    const patientsService = usePatientsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IPatientResponse, AxiosError, IPatientResponse, QueryKey>({
        queryKey: [PatientsQueries.getById, id],
        queryFn: async () => await patientsService.getById(id),
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

export const usePagedPatientsQuery = (form: IGetPatientsForm, enabled = false) => {
    const patientsService = usePatientsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IPagedResponse<IPatientInformationResponse>, AxiosError, IPagedResponse<IPatientInformationResponse>, QueryKey>({
        queryKey: [PatientsQueries.getPaged, { ...form }],
        queryFn: async () => await patientsService.getPaged({ ...form }),
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

export const useCreatePatientCommand = (form: IPatientForm, setError: UseFormSetError<IPatientForm>) => {
    const patientsService = usePatientsService();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const id = useMemo(() => uuid(), []);

    let request = useMemo(
        () =>
            ({
                ...form,
                dateOfBirth: dayjs(form.dateOfBirth).format(dateApiFormat),
            } as ICreatePatientRequest),
        [form]
    );

    return useMutation<ICreatedResponse, AxiosError<any, any>, void>({
        mutationFn: async () => {
            request.id = id;

            return await patientsService.create(request);
        },
        retry: false,
        onSuccess: () => {
            queryClient.setQueryData<IPatientResponse>([PatientsQueries.getById, id], { ...request, isActive: true } as IPatientResponse);
            queryClient.invalidateQueries([PatientsQueries.getPaged]);
            navigate(AppRoutes.Patients);
            enqueueSnackbar('Patient created successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('firstName', {
                    message: error.response.data.errors?.FirstName?.[0] || error.response.data.Message || '',
                });
                setError('lastName', {
                    message: error.response.data.errors?.LastName?.[0] || error.response.data.Message || '',
                });
                setError('dateOfBirth', {
                    message: error.response.data.errors?.DateOfBirth?.[0] || error.response.data.Message || '',
                });
                setError('phoneNumber', {
                    message: error.response.data.errors?.PhoneNumber?.[0] || error.response.data.Message || '',
                });
            } else {
                navigate(AppRoutes.Patients);
                enqueueSnackbar('Something went wrong.', {
                    variant: 'error',
                });
            }
        },
    });
};

export const useUpdatePatientCommand = (id: string, form: IPatientForm, setError: UseFormSetError<IPatientForm>) => {
    const patientsService = usePatientsService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    let request = useMemo(
        () =>
            ({
                ...form,
                dateOfBirth: form.dateOfBirth?.format(dateApiFormat) ?? '',
            } as IUpdatePatientRequest),
        [form]
    );

    return useMutation<INoContentResponse, AxiosError<any, any>, { photoId: string }>({
        mutationFn: async ({ photoId }) => {
            request.photoId = photoId;

            return await patientsService.update(id, request);
        },
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData([PatientsQueries.getById, id], {
                ...request,
                photoId: variables.photoId,
            } as IPatientResponse);
            queryClient.invalidateQueries([PatientsQueries.getPaged]);
            enqueueSnackbar('Patient updated successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('firstName', {
                    message: error.response.data.errors?.FirstName?.[0] || error.response.data.Message || '',
                });
                setError('lastName', {
                    message: error.response.data.errors?.LastName?.[0] || error.response.data.Message || '',
                });
                setError('dateOfBirth', {
                    message: error.response.data.errors?.DateOfBirth?.[0] || error.response.data.Message || '',
                });
                setError('phoneNumber', {
                    message: error.response.data.errors?.PhoneNumber?.[0] || error.response.data.Message || '',
                });
            }
        },
    });
};

export const useRemovePatientCommand = () => {
    const patientService = usePatientsService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<INoContentResponse, AxiosError, { id: string }>({
        mutationFn: async ({ id }) => await patientService.remove(id),
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.removeQueries([PatientsQueries.getById, variables.id]);
            queryClient.invalidateQueries([PatientsQueries.getPaged]);
            enqueueSnackbar('Patient removed successfully!', {
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
