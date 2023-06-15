import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ServicesQueries } from '../../constants/QueryKeys';
import { AppRoutes } from '../../constants/AppRoutes';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { ICreateServiceRequest, IGetPagedServicesRequest, IUpdateServiceRequest } from '../../types/request/services';
import { IServiceInformationResponse, IServiceResponse } from '../../types/response/services';
import { useServicesService } from '../services/useServicesService';
import { IServiceForm, useServiceValidator } from '../validators/services/create&update';

export const useGetServiceByIdQuery = (id: string, enabled = false) => {
    const servicesService = useServicesService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IServiceResponse, AxiosError, IServiceResponse, QueryKey>({
        queryKey: [ServicesQueries.getById, id],
        queryFn: async () => await servicesService.getById(id),
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

export const usePagedServicesQuery = (request: IGetPagedServicesRequest, enabled = false) => {
    const servicesService = useServicesService();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IPagedResponse<IServiceInformationResponse>, AxiosError, IPagedResponse<IServiceInformationResponse>, QueryKey>({
        queryKey: [ServicesQueries.getPaged, { ...request }],
        queryFn: async () => await servicesService.getPaged(request),
        enabled: enabled,
        retry: false,
        keepPreviousData: true,
        onSuccess: (response) => {
            response.items.forEach((item) => {
                const { id, duration, ...rest } = item;
                queryClient.setQueryData<IServiceResponse>([ServicesQueries.getById, item.id], rest as IServiceResponse);
            });
        },
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

export const useCreateServiceCommand = () => {
    const serviceService = useServicesService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { requestValidationScheme } = useServiceValidator();

    return useMutation<ICreatedResponse, AxiosError<any, any>, IServiceForm>({
        mutationFn: async (form: IServiceForm) => {
            await requestValidationScheme.validate(form);

            return await serviceService.create({
                title: form.title,
                price: form.price,
                specializationId: form.specializationId,
                categoryId: form.categoryId,
                isActive: form.isActive,
            } as ICreateServiceRequest);
        },
        retry: false,
        onSuccess: (data, form) => {
            queryClient.setQueryData([ServicesQueries.getById, data.id], {
                title: form.title,
                price: form.price,
                specializationId: form.specializationId,
                categoryId: form.categoryId,
                categoryTitle: form.categoryInput,
                isActive: form.isActive,
            } as IServiceResponse);
            queryClient.invalidateQueries([ServicesQueries.getPaged]);
            enqueueSnackbar(`Service "${form.title}" created successfully!`, {
                variant: 'success',
            });
        },
        onError: (error, form) => {
            if (error.response?.status === 400) {
                enqueueSnackbar(`Something went wrong. Service "${form.title}" wasn't create.`, {
                    variant: 'error',
                });
            }
        },
    });
};

export const useUpdateServiceCommand = (form: IServiceForm, setError: UseFormSetError<IServiceForm>) => {
    const serviceService = useServicesService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { requestValidationScheme } = useServiceValidator();

    return useMutation<INoContentResponse, AxiosError<any, any>, { id: string }>({
        mutationFn: async ({ id }) => {
            await requestValidationScheme.validate(form);

            return await serviceService.update(id, {
                title: form.title,
                price: form.price,
                categoryId: form.categoryId,
                timeSlotSize: form.categoryDuration,
                specializationId: form.specializationId,
                isActive: form.isActive,
            } as IUpdateServiceRequest);
        },
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData([ServicesQueries.getById, variables.id], {
                title: form.title,
                price: form.price,
                specializationId: form.specializationId,
                categoryId: form.categoryId,
                categoryTitle: form.categoryInput,
                isActive: form.isActive,
            } as IServiceResponse);
            queryClient.setQueriesData<IPagedResponse<IServiceInformationResponse>>([ServicesQueries.getPaged], (prev) => {
                return {
                    ...prev,
                    items: prev?.items.map((item) => {
                        if (item.id === variables.id) {
                            return {
                                id: variables.id,
                                title: form.title,
                                price: form.price,
                                categoryTitle: form.categoryInput,
                                duration: form.categoryDuration,
                                specializationId: form.specializationId,
                                isActive: form.isActive,
                            } as IServiceInformationResponse;
                        }
                        return item;
                    }),
                } as IPagedResponse<IServiceInformationResponse>;
            });
            enqueueSnackbar('Service updated successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('title', {
                    message: error.response.data.errors?.Title?.[0] || error.response.data.Message || '',
                });
                setError('price', {
                    message: error.response.data.errors?.Price?.[0] || error.response.data.Message || '',
                });
                setError('specializationId', {
                    message: error.response.data.errors?.SpecializationId?.[0] || error.response.data.Message || '',
                });
                setError('categoryId', {
                    message:
                        error.response.data.errors?.CategoryId?.[0] ||
                        error.response.data.errors?.TimeSlotSize?.[0] ||
                        error.response.data.Message ||
                        '',
                });
                setError('isActive', {
                    message: error.response.data.errors?.IsActive?.[0] || error.response.data.Message || '',
                });
            }
        },
    });
};

export const useChangeServiceStatusCommand = (specializationId: string) => {
    const serviceService = useServicesService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<INoContentResponse, AxiosError, { id: string; isActive: boolean }>({
        mutationFn: async ({ id, isActive }) => await serviceService.changeStatus(id, isActive),
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData<IServiceResponse>([ServicesQueries.getById, variables.id], (prev) => {
                if (prev !== undefined) {
                    return {
                        ...prev,
                        isActive: variables.isActive,
                    } as IServiceResponse;
                }
                return prev;
            });
            queryClient.setQueriesData<IPagedResponse<IServiceInformationResponse>>(
                [ServicesQueries.getPaged, { specializationId: specializationId } as IGetPagedServicesRequest],
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
                    } as IPagedResponse<IServiceInformationResponse>)
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
