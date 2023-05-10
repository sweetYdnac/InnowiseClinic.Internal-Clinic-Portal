import { QueryKey, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesService from '../api/services/ServicesService';
import { AppRoutes } from '../constants/AppRoutes';
import { ServicesQueries } from '../constants/queries';
import { IPagedRequest } from '../types/common/Requests';
import { IPagingData } from '../types/common/Responses';
import { IGetPagedServicesFilters, IGetPagedServicesRequest } from '../types/request/services';
import { IServiceInformationResponse } from '../types/response/services';
import { showPopup } from '../utils/functions';

export const usePagedServices = (initialPagingData: IPagedRequest, filters: IGetPagedServicesFilters, enabled = false) => {
    const navigate = useNavigate();
    const [pagingData, setPagingData] = useState({
        ...initialPagingData,
    } as IPagingData);

    const query = useQuery<IServiceInformationResponse[], Error, IServiceInformationResponse[], QueryKey>({
        initialData: enabled ? undefined : [],
        queryKey: [
            ServicesQueries.getServices,
            { currentPage: pagingData.currentPage, pageSize: pagingData.pageSize, ...filters } as IGetPagedServicesRequest,
        ],
        queryFn: async () => {
            const request: IGetPagedServicesRequest = {
                currentPage: pagingData.currentPage,
                pageSize: pagingData.pageSize,
                ...filters,
            };

            const { items, ...paging } = await ServicesService.getPaged(request);
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
