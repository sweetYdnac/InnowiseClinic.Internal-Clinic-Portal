import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SpecializationsQueries } from '../../constants/QueryKeys';
import { AppRoutes } from '../../routes/AppRoutes';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import {
    ICreateSpecializationRequest,
    IGetPagedSpecializationsRequest,
    IUpdateSpecializationRequest,
} from '../../types/request/specializations';
import { ISpecializationResponse } from '../../types/response/specializations';
import { useSpecializationsService } from '../services/useSpecializationsService';
import { ISpecializationForm } from '../validators/specializations/create&update';

export const useSpecializationQuery = (id: string, enabled = false) => {
    const specializationsService = useSpecializationsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<ISpecializationResponse, AxiosError, ISpecializationResponse, QueryKey>({
        queryKey: [SpecializationsQueries.getById, id],
        queryFn: async () => await specializationsService.getById(id),
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

export const usePagedSpecializationsQuery = (request: IGetPagedSpecializationsRequest, enabled = false) => {
    const specializationsService = useSpecializationsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { title, ...rest } = request;

    return useQuery<IPagedResponse<ISpecializationResponse>, AxiosError, IPagedResponse<ISpecializationResponse>, QueryKey>({
        initialData: enabled ? undefined : ({ items: [] as ISpecializationResponse[] } as IPagedResponse<ISpecializationResponse>),
        queryKey: [SpecializationsQueries.getPaged, { ...rest }],
        queryFn: async () => await specializationsService.getPaged(request),
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

export const useCreateSpecializationCommand = (form: ISpecializationForm, setError: UseFormSetError<ISpecializationForm>) => {
    const specializationService = useSpecializationsService();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<ICreatedResponse, AxiosError<any, any>, void>({
        mutationFn: async () =>
            await specializationService.create({
                title: form.title,
                isActive: form.isActive,
            } as ICreateSpecializationRequest),
        retry: false,
        onSuccess: (data) => {
            queryClient.setQueryData([SpecializationsQueries.getById, data.id], {
                id: data.id,
                title: form.title,
                isActive: form.isActive,
            } as ISpecializationResponse);
            queryClient.invalidateQueries([SpecializationsQueries.getPaged]);
            enqueueSnackbar(`Specialization "${form.title}" created successfully!`, {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Specializations);
                enqueueSnackbar(`Something went wrong. Specialization "${form.title}" wasn't create.`, {
                    variant: 'error',
                });
            }
        },
    });
};

export const useUpdateSpecializationCommand = (id: string, form: ISpecializationForm, setError: UseFormSetError<ISpecializationForm>) => {
    const specializationService = useSpecializationsService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<INoContentResponse, AxiosError<any, any>, void>({
        mutationFn: async () =>
            await specializationService.update(id, {
                title: form.title,
                isActive: form.isActive,
            } as IUpdateSpecializationRequest),
        retry: false,
        onSuccess: (data) => {
            queryClient.setQueryData([SpecializationsQueries.getById, id], {
                id: id,
                title: form.title,
                isActive: form.isActive,
            } as ISpecializationResponse);
            queryClient.setQueriesData<IPagedResponse<ISpecializationResponse>>([SpecializationsQueries.getPaged], (prev) => {
                return {
                    ...prev,
                    items: prev?.items.map((item) => {
                        if (item.id === id) {
                            return {
                                id: id,
                                title: form.title,
                                isActive: form.isActive,
                            } as ISpecializationResponse;
                        }
                        return item;
                    }),
                } as IPagedResponse<ISpecializationResponse>;
            });
            enqueueSnackbar('Specialization updated successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('title', {
                    message: error.response.data.errors?.Title?.[0] || error.response.data.Message || '',
                });
                setError('isActive', {
                    message: error.response.data.errors?.IsActive?.[0] || error.response.data.Message || '',
                });
            }
        },
    });
};

export const useChangeSpecializationStatusCommand = () => {
    const specializationsService = useSpecializationsService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<INoContentResponse, AxiosError, { id: string; isActive: boolean }>({
        mutationFn: async ({ id, isActive }) => await specializationsService.changeStatus(id, isActive),
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData<ISpecializationResponse>([SpecializationsQueries.getById, variables.id], (prev) => {
                if (prev !== undefined) {
                    return {
                        ...prev,
                        isActive: variables.isActive,
                    } as ISpecializationResponse;
                }
                return prev;
            });
            queryClient.setQueriesData<IPagedResponse<ISpecializationResponse>>(
                [SpecializationsQueries.getPaged],
                (prev) =>
                    ({
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
                    } as IPagedResponse<ISpecializationResponse>)
            );
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
