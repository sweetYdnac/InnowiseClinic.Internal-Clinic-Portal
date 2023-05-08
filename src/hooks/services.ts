import { QueryKey, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesService from '../api/services/ServicesService';
import { ServicesQueries } from '../constants/queries';
import { IPagingData } from '../types/common/Responses';
import { AppRoutes } from '../constants/AppRoutes';
import { IGetPagedServicesRequest } from '../types/request/ServicesAPI';
import { IServiceInformationResponse } from '../types/response/ServicesAPI';
import { showPopup } from '../utils/functions';

export const usePagedServices = (initialPagingData: IPagingData, title: string) => {
    const navigate = useNavigate();
    const [pagingData, setPagingData] = useState(initialPagingData);

    const query = useQuery<IServiceInformationResponse[], Error, IServiceInformationResponse[], QueryKey>({
        queryKey: [
            ServicesQueries.getServices,
            { currentPage: pagingData.currentPage, pageSize: pagingData.pageSize, title: title } as IGetPagedServicesRequest,
        ],
        queryFn: async () => {
            const request: IGetPagedServicesRequest = {
                currentPage: pagingData.currentPage,
                pageSize: pagingData.pageSize,
                title: title,
                isActive: true,
            };

            const { items, ...paging } = await ServicesService.getPaged(request);
            setPagingData(paging as IPagingData);

            return items;
        },
        enabled: true,
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
