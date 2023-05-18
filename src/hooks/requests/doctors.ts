import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../routes/AppRoutes';
import { DoctorsQueries } from '../../constants/QueryKeys';
import { dateApiFormat } from '../../constants/Formats';
import { IChangeStatusRequest } from '../../types/common/Requests';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { ICreateDoctorRequest, IGetPagedDoctorsRequest, IUpdateDoctorRequest } from '../../types/request/doctors';
import { IDoctorInformationResponse, IDoctorResponse } from '../../types/response/doctors';
import { useDoctorsService } from '../services/useDoctorsService';
import { ICreateDoctorForm } from '../validators/doctors/create';
import { IUpdateDoctorForm } from '../validators/doctors/update';

export const useDoctorQuery = (id: string, enabled = false) => {
    const doctorsService = useDoctorsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IDoctorResponse, AxiosError, IDoctorResponse, QueryKey>({
        queryKey: [DoctorsQueries.getById, id],
        queryFn: async () => await doctorsService.getById(id),
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

export const usePagedDoctorsQuery = (request: IGetPagedDoctorsRequest, enabled = false) => {
    const doctorsService = useDoctorsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IPagedResponse<IDoctorInformationResponse>, AxiosError, IPagedResponse<IDoctorInformationResponse>, QueryKey>({
        queryKey: [DoctorsQueries.getPaged, { ...request }],
        queryFn: async () => await doctorsService.getPaged(request),
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

export const useChangeDoctorStatusCommand = () => {
    const doctorsService = useDoctorsService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<INoContentResponse, AxiosError, { id: string; status: number }>({
        mutationFn: async ({ id, status }) => await doctorsService.changeStatus(id, { status: status } as IChangeStatusRequest),
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData<IDoctorResponse>([DoctorsQueries.getById, variables.id], (prev) => {
                if (prev !== undefined) {
                    return {
                        ...prev,
                        status: variables.status,
                    } as IDoctorResponse;
                }
                return prev;
            });
            queryClient.setQueriesData<IPagedResponse<IDoctorInformationResponse>>([DoctorsQueries.getPaged], (prev) => {
                return {
                    ...prev,
                    items: prev?.items.map((item) => {
                        if (item.id === variables.id) {
                            return {
                                ...item,
                                status: variables.status,
                            };
                        }
                        return item;
                    }),
                } as IPagedResponse<IDoctorInformationResponse>;
            });
            enqueueSnackbar('Status changed successfully!', {
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

export const useCreateDoctorCommand = (form: ICreateDoctorForm, setError: UseFormSetError<ICreateDoctorForm>) => {
    const doctorsService = useDoctorsService();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    let request = useMemo(
        () =>
            ({
                firstName: form.firstName,
                lastName: form.lastName,
                middleName: form.middleName,
                dateOfBirth: form.dateOfBirth?.format(dateApiFormat) ?? '',
                specializationId: form.specializationId,
                officeId: form.officeId,
                careerStartYear: form.careerStartYear?.year() ?? 0,
                specializationName: form.specializationInput,
                officeAddress: form.officeInput,
                status: form.status,
            } as ICreateDoctorRequest),
        [
            form.careerStartYear,
            form.dateOfBirth,
            form.firstName,
            form.lastName,
            form.middleName,
            form.officeId,
            form.officeInput,
            form.specializationId,
            form.specializationInput,
            form.status,
        ]
    );

    return useMutation<ICreatedResponse, AxiosError<any, any>, { accountId: string; photoId: string | null }>({
        mutationFn: async ({ accountId, photoId }) => {
            request.id = accountId;
            request.photoId = photoId;

            return await doctorsService.create(request);
        },
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData([DoctorsQueries.getById, variables.accountId], { ...request, photoId: variables.photoId });
            queryClient.invalidateQueries([DoctorsQueries.getPaged]);
            navigate(AppRoutes.Doctors);
            enqueueSnackbar('Doctor created successfully!', {
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
                setError('careerStartYear', {
                    message: error.response.data.errors?.CareerStartYear?.[0] || error.response.data.Message || '',
                });
                setError('specializationId', {
                    message:
                        error.response.data.errors?.SpecializationId?.[0] ||
                        error.response.data.errors?.SpecializationName?.[0] ||
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
                setError('status', {
                    message: error.response.data.errors?.Status?.[0] || error.response.data.Message || '',
                });
            }
        },
    });
};

export const useUpdateDoctorCommand = (id: string, form: IUpdateDoctorForm, setError: UseFormSetError<IUpdateDoctorForm>) => {
    const doctorsService = useDoctorsService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    let request = useMemo(
        () =>
            ({
                photoId: form.photoId,
                firstName: form.firstName,
                lastName: form.lastName,
                middleName: form.middleName,
                dateOfBirth: form.dateOfBirth?.format(dateApiFormat) ?? '',
                officeId: form.officeId,
                officeAddress: form.officeInput,
                specializationId: form.specializationId,
                specializationName: form.specializationInput,
                careerStartYear: form.careerStartYear?.year() ?? 0,
                status: form.status,
            } as IUpdateDoctorRequest),
        [
            form.careerStartYear,
            form.dateOfBirth,
            form.firstName,
            form.lastName,
            form.middleName,
            form.officeId,
            form.officeInput,
            form.photoId,
            form.specializationId,
            form.specializationInput,
            form.status,
        ]
    );

    return useMutation<INoContentResponse, AxiosError<any, any>, string>({
        mutationFn: async (photoId: string) => {
            request.photoId = photoId;

            return await doctorsService.update(id, request);
        },
        retry: false,
        onSuccess: (data, photoId) => {
            queryClient.setQueryData([DoctorsQueries.getById, id], {
                ...request,
                photoId: photoId,
            } as IDoctorResponse);
            queryClient.invalidateQueries([DoctorsQueries.getPaged]);
            enqueueSnackbar('Doctor updated successfully!', {
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
                setError('careerStartYear', {
                    message: error.response.data.errors?.CareerStartYear?.[0] || error.response.data.Message || '',
                });
                setError('specializationId', {
                    message:
                        error.response.data.errors?.SpecializationId?.[0] ||
                        error.response.data.errors?.SpecializationName?.[0] ||
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
                setError('status', {
                    message: error.response.data.errors?.Status?.[0] || error.response.data.Message || '',
                });
            }
        },
    });
};
