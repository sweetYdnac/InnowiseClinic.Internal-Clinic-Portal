import { QueryKey, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecializationsService from '../api/services/SpecializationsService';
import { AppRoutes } from '../constants/AppRoutes';
import { SpecializationsQueries } from '../constants/queries';
import { IPagingData } from '../types/common/Responses';
import { IGetPagedSpecializationsRequest } from '../types/request/specializations';
import { ISpecializationResponse } from '../types/response/specializations';
import { showPopup } from '../utils/functions';

export const usePagedSpecializations = (initialPagingData: IPagingData, title: string, enabled = true) => {
    const navigate = useNavigate();
    const [pagingData, setPagingData] = useState(initialPagingData);

    const query = useQuery<ISpecializationResponse[], Error, ISpecializationResponse[], QueryKey>({
        queryKey: [
            SpecializationsQueries.getSpecializations,
            { currentPage: pagingData.currentPage, pageSize: pagingData.pageSize, title: title },
        ],
        queryFn: async () => {
            const request: IGetPagedSpecializationsRequest = {
                currentPage: pagingData.currentPage,
                pageSize: pagingData.pageSize,
                title: title,
                isActive: true,
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
