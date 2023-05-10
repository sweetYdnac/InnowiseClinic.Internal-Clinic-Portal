import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecializationsService from '../api/services/SpecializationsService';
import { AppRoutes } from '../constants/AppRoutes';
import { SpecializationsQueries } from '../constants/queries';
import { IPagedRequest } from '../types/common/Requests';
import { IPagingData } from '../types/common/Responses';
import { IGetPagedSpecializationsFilters, IGetPagedSpecializationsRequest } from '../types/request/specializations';
import { ISpecializationResponse } from '../types/response/specializations';
import { showPopup } from '../utils/functions';

export const usePagedSpecializations = (initialPagingData: IPagedRequest, filters: IGetPagedSpecializationsFilters, enabled = false) => {
    const navigate = useNavigate();
    const [pagingData, setPagingData] = useState({
        ...initialPagingData,
    } as IPagingData);

    const { title, ...rest } = filters;

    const query = useQuery<ISpecializationResponse[], AxiosError, ISpecializationResponse[], QueryKey>({
        initialData: enabled ? undefined : [],
        queryKey: [
            SpecializationsQueries.getSpecializations,
            { currentPage: pagingData.currentPage, pageSize: pagingData.pageSize, ...rest },
        ],
        queryFn: async () => {
            const request: IGetPagedSpecializationsRequest = {
                currentPage: pagingData.currentPage,
                pageSize: pagingData.pageSize,
                ...filters,
            };

            const { items, ...paging } = await SpecializationsService.getPaged(request);
            setPagingData(paging as IPagingData);

            return items;
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

    return {
        pagingData,
        setPagingData,
        ...query,
    };
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
