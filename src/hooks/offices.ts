import { QueryKey, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficesService from '../api/services/OfficesService';
import { AppRoutes } from '../constants/AppRoutes';
import { OfficesQueries } from '../constants/queries';
import { IPagedRequest } from '../types/common/Requests';
import { IPagingData } from '../types/common/Responses';
import { IGetPagedOfficesRequest } from '../types/request/offices';
import { IOfficeInformationResponse } from '../types/response/offices';
import { showPopup } from '../utils/functions';

export const usePagedOffices = (initialPagingData: IPagedRequest, enabled = false) => {
    const navigate = useNavigate();
    const [pagingData, setPagingData] = useState({
        ...initialPagingData,
    } as IPagingData);

    const query = useQuery<IOfficeInformationResponse[], Error, IOfficeInformationResponse[], QueryKey>({
        initialData: enabled ? undefined : [],
        queryKey: [
            OfficesQueries.getOffices,
            { currentPage: pagingData.currentPage, pageSize: pagingData.pageSize } as IGetPagedOfficesRequest,
        ],
        queryFn: async () => {
            const request: IGetPagedOfficesRequest = {
                currentPage: pagingData.currentPage,
                pageSize: pagingData.pageSize,
            };

            const { items, ...paging } = await OfficesService.getPaged(request);
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
