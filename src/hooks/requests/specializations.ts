import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { SpecializationsQueries } from '../../constants/QueryKeys';
import { AppRoutes } from '../../routes/AppRoutes';
import { INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { IGetPagedSpecializationsRequest } from '../../types/request/specializations';
import { ISpecializationResponse } from '../../types/response/specializations';
import { useSpecializationsService } from '../services/useSpecializationsService';

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
            queryClient.setQueriesData<IPagedResponse<ISpecializationResponse>>([SpecializationsQueries.getPaged], (prev) => {
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
                } as IPagedResponse<ISpecializationResponse>;
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
