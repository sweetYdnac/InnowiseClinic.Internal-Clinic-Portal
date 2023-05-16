import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ValidationError } from 'yup';
import { SpecializationsService } from '../api/services/SpecializationsService';
import { AppRoutes } from '../constants/AppRoutes';
import { SpecializationsQueries } from '../constants/queries';
import { IPagedResponse } from '../types/common/Responses';
import { IGetPagedSpecializationsRequest } from '../types/request/specializations';
import { ISpecializationResponse } from '../types/response/specializations';
import { showPopup } from '../utils/functions';
import { useGetPagedSpecializationsValidator } from './validators/specializations/getPaged';

export const usePagedSpecializationsQuery = (request: IGetPagedSpecializationsRequest, enabled = false) => {
    const navigate = useNavigate();
    const { validationScheme } = useGetPagedSpecializationsValidator();

    const { title, ...rest } = request;

    return useQuery<IPagedResponse<ISpecializationResponse> | void, AxiosError, IPagedResponse<ISpecializationResponse>, QueryKey>({
        initialData: enabled ? undefined : ({ items: [] as ISpecializationResponse[] } as IPagedResponse<ISpecializationResponse>),
        queryKey: [SpecializationsQueries.getPaged, { ...rest }],
        queryFn: async () => {
            try {
                await validationScheme.validate(request);

                return await SpecializationsService.getPaged(request);
            } catch (error) {
                if (error instanceof ValidationError) {
                    navigate(AppRoutes.Home);
                    showPopup('Something went wrong.');
                }
            }
        },
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

export const useSpecializationQuery = (id: string, enabled = false) => {
    const navigate = useNavigate();

    return useQuery<ISpecializationResponse, AxiosError, ISpecializationResponse, QueryKey>({
        queryKey: [SpecializationsQueries.getById, id],
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
