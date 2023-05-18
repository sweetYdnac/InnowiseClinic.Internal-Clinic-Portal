import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../constants/AppRoutes';
import { OfficesQueries } from '../../constants/QueryKeys';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { IGetPagedOfficesRequest, IUpdateOfficeRequest } from '../../types/request/offices';
import { IOfficeInformationResponse, IOfficeResponse } from '../../types/response/offices';
import { useOfficesService } from '../services/useOfficesService';
import { ICreateOfficeForm } from '../validators/offices/create';
import { IUpdateOfficeForm } from '../validators/offices/update';

export const useOfficeQuery = (id: string) => {
    const officesService = useOfficesService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IOfficeResponse, AxiosError, IOfficeResponse, QueryKey>({
        queryKey: [OfficesQueries.getById, id],
        queryFn: async () => await officesService.getById(id),
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

export const usePagedOfficesQuery = (request: IGetPagedOfficesRequest, enabled = false) => {
    const officesService = useOfficesService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IPagedResponse<IOfficeInformationResponse>, AxiosError, IPagedResponse<IOfficeInformationResponse>, QueryKey>({
        initialData: enabled ? undefined : ({ items: [] as IOfficeInformationResponse[] } as IPagedResponse<IOfficeInformationResponse>),
        queryKey: [OfficesQueries.getPaged, { ...request }],
        queryFn: async () => await officesService.getPaged(request),
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

export const useChangeOfficeStatusCommand = () => {
    const officesService = useOfficesService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<INoContentResponse, AxiosError, { id: string; isActive: boolean }>({
        mutationFn: async ({ id, isActive }) => await officesService.changeStatus(id, isActive),
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData<IOfficeResponse>([OfficesQueries.getById, variables.id], (prev) => {
                if (prev !== undefined) {
                    return {
                        ...prev,
                        isActive: variables.isActive,
                    } as IOfficeResponse;
                }
                return prev;
            });
            queryClient.setQueriesData<IPagedResponse<IOfficeInformationResponse>>([OfficesQueries.getPaged], (prev) => {
                return {
                    ...prev,
                    items: prev?.items.map((item) => {
                        if (item.id === variables.id) {
                            return {
                                ...item,
                                isActive: variables.isActive,
                            };
                        }
                        return item;
                    }),
                } as IPagedResponse<IOfficeInformationResponse>;
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

export const useUpdateOfficeCommand = (id: string, form: IUpdateOfficeForm, setError: UseFormSetError<IUpdateOfficeForm>) => {
    const officesService = useOfficesService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    let request = useMemo(
        () =>
            ({
                ...form,
            } as IUpdateOfficeRequest),
        [form]
    );

    return useMutation<INoContentResponse, AxiosError<any, any>, string>({
        mutationFn: async (photoId: string) => {
            request.photoId = photoId;

            return await officesService.update(id, request);
        },
        retry: false,
        onSuccess: (data, photoId) => {
            queryClient.setQueryData([OfficesQueries.getById, id], {
                photoId: photoId,
                address: `${request.city}, ${request.street}, ${request.houseNumber}, ${request.officeNumber}`,
                registryPhoneNumber: request.registryPhoneNumber,
                isActive: request.isActive,
            } as IOfficeResponse);
            queryClient.setQueriesData<IPagedResponse<IOfficeInformationResponse>>([OfficesQueries.getPaged], (prev) => {
                return {
                    ...prev,
                    items: prev?.items.map((item) => {
                        if (item.id === id) {
                            return {
                                id: id,
                                address: `${request.city}, ${request.street}, ${request.houseNumber}, ${request.officeNumber}`,
                                registryPhoneNumber: request.registryPhoneNumber,
                                isActive: request.isActive,
                            } as IOfficeInformationResponse;
                        }
                        return item;
                    }),
                } as IPagedResponse<IOfficeInformationResponse>;
            });
            enqueueSnackbar('Office updated successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('city', {
                    message: error.response.data.errors?.City?.[0] || error.response.data.Message || '',
                });
                setError('street', {
                    message: error.response.data.errors?.Street?.[0] || error.response.data.Message || '',
                });
                setError('houseNumber', {
                    message: error.response.data.errors?.HouseNumber?.[0] || error.response.data.Message || '',
                });
                setError('officeNumber', {
                    message: error.response.data.errors?.OfficeNumber?.[0] || error.response.data.Message || '',
                });
                setError('registryPhoneNumber', {
                    message: error.response.data.errors?.RegistryPhoneNumber?.[0] || error.response.data.Message || '',
                });
                setError('isActive', {
                    message: error.response.data.errors?.IsActive?.[0] || error.response.data.Message || '',
                });
            }
        },
    });
};

export const useCreateOfficeCommand = (form: ICreateOfficeForm, setError: UseFormSetError<ICreateOfficeForm>) => {
    const officesService = useOfficesService();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<ICreatedResponse, AxiosError<any, any>, { photoId: string | null }>({
        mutationFn: async ({ photoId }) =>
            await officesService.create({
                ...form,
                photoId: photoId,
            }),
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData([OfficesQueries.getById, data.id], {
                photoId: variables.photoId,
                address: `${form.city}, ${form.street}, ${form.houseNumber}, ${form.officeNumber}`,
                registryPhoneNumber: form.registryPhoneNumber,
                isActive: form.isActive,
            } as IOfficeResponse);
            queryClient.invalidateQueries([OfficesQueries.getPaged]);
            navigate(AppRoutes.Offices);
            enqueueSnackbar('Office created successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('city', {
                    message: error.response.data.errors?.City?.[0] || error.response.data.Message || '',
                });
                setError('street', {
                    message: error.response.data.errors?.Street?.[0] || error.response.data.Message || '',
                });
                setError('houseNumber', {
                    message: error.response.data.errors?.HouseNumber?.[0] || error.response.data.Message || '',
                });
                setError('officeNumber', {
                    message: error.response.data.errors?.OfficeNumber?.[0] || error.response.data.Message || '',
                });
                setError('registryPhoneNumber', {
                    message: error.response.data.errors?.RegistryPhoneNumber?.[0] || error.response.data.Message || '',
                });
                setError('isActive', {
                    message: error.response.data.errors?.IsActive?.[0] || error.response.data.Message || '',
                });
            }
        },
    });
};
