import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { SpecializationsService } from '../../api/services/SpecializationsService';
import { AppRoutes } from '../../constants/AppRoutes';
import { SpecializationsQueries } from '../../constants/QueryKeys';
import { IPagedResponse } from '../../types/common/Responses';
import { IGetPagedSpecializationsRequest } from '../../types/request/specializations';
import { ISpecializationResponse } from '../../types/response/specializations';

export const usePagedSpecializationsQuery = (request: IGetPagedSpecializationsRequest, enabled = false) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { title, ...rest } = request;

    return useQuery<IPagedResponse<ISpecializationResponse>, AxiosError, IPagedResponse<ISpecializationResponse>, QueryKey>({
        initialData: enabled ? undefined : ({ items: [] as ISpecializationResponse[] } as IPagedResponse<ISpecializationResponse>),
        queryKey: [SpecializationsQueries.getPaged, { ...rest }],
        queryFn: async () => await SpecializationsService.getPaged(request),
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

export const useSpecializationQuery = (id: string, enabled = false) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<ISpecializationResponse, AxiosError, ISpecializationResponse, QueryKey>({
        queryKey: [SpecializationsQueries.getById, id],
        queryFn: async () => await SpecializationsService.getById(id),
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
