import { QueryKey, useQuery } from '@tanstack/react-query';
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

    const query = useQuery<ISpecializationResponse[], Error, ISpecializationResponse[], QueryKey>({
        initialData: enabled ? undefined : [],
        queryKey: [
            SpecializationsQueries.getSpecializations,
            { currentPage: pagingData.currentPage, pageSize: pagingData.pageSize, ...filters },
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
        onError: () => {
            navigate(AppRoutes.Home);
            showPopup('Something went wrong.');
        },
    });

    return {
        pagingData,
        setPagingData,
        ...query,
    };
};
