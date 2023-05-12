import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { SpecializationsService } from '../api/services/SpecializationsService';
import { AppRoutes } from '../constants/AppRoutes';
import { SpecializationsQueries } from '../constants/queries';
import { IPagedResponse } from '../types/common/Responses';
import { IGetPagedSpecializationsRequest } from '../types/request/specializations';
import { ISpecializationResponse } from '../types/response/specializations';
import { showPopup } from '../utils/functions';

export const usePagedSpecializations = (request: IGetPagedSpecializationsRequest, enabled = false) => {
    const navigate = useNavigate();

    const { title, ...rest } = request;

    return useQuery<IPagedResponse<ISpecializationResponse>, AxiosError, IPagedResponse<ISpecializationResponse>, QueryKey>({
        initialData: enabled ? undefined : ({ items: [] as ISpecializationResponse[] } as IPagedResponse<ISpecializationResponse>),
        queryKey: [SpecializationsQueries.getSpecializations, { ...rest }],
        queryFn: async () => await SpecializationsService.getPaged(request),
        enabled: enabled,
        retry: false,
        keepPreviousData: true,
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                showPopup('Something went wrong.');
            }
        },
    });
};

export const useSpecialization = (id: string, enabled = false) => {
    const navigate = useNavigate();

    return useQuery<ISpecializationResponse, AxiosError, ISpecializationResponse, QueryKey>({
        queryKey: [SpecializationsQueries.getSpecializationById, id],
        queryFn: async () => await SpecializationsService.getById(id),
        enabled: enabled,
        retry: false,
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                showPopup('Something went wrong.');
            }
        },
    });
};
