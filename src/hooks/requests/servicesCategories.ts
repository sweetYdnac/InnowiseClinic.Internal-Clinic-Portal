import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { ServiceCategoriesQueries } from '../../constants/QueryKeys';
import { AppRoutes } from '../../constants/AppRoutes';
import { IServiceCategoryResponse } from '../../types/response/serviceCategories';
import { useServiceCategoriesService } from '../services/useServicesCategories';

export const useGetServiceCategoryById = (id: string, enabled = false) => {
    const serviceCategoriesService = useServiceCategoriesService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IServiceCategoryResponse, AxiosError, IServiceCategoryResponse, QueryKey>({
        queryKey: [ServiceCategoriesQueries.getById, id],
        queryFn: async () => await serviceCategoriesService.getById(id),
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

export const useGetAllServiceCategories = () => {
    const serviceCategoriesService = useServiceCategoriesService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IServiceCategoryResponse[], AxiosError, IServiceCategoryResponse[], QueryKey>({
        queryKey: [ServiceCategoriesQueries.getAll],
        queryFn: async () => await serviceCategoriesService.getAll(),
        retry: false,
        staleTime: Infinity,
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
