import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorsService } from '../api/services/DoctorsService';
import { AppRoutes } from '../constants/AppRoutes';
import { DoctorsQueries } from '../constants/queries';
import { IPagedRequest } from '../types/common/Requests';
import { IPagingData } from '../types/common/Responses';
import { IGetPagedDoctorsFiltes as IGetPagedDoctorsFilters, IGetPagedDoctorsRequest } from '../types/request/doctors';
import { IDoctorInformationResponse } from '../types/response/doctors';
import { showPopup } from '../utils/functions';

export const usePagedDoctors = (initialPagingData: IPagedRequest, filters: IGetPagedDoctorsFilters, enabled = false) => {
    const navigate = useNavigate();
    const [pagingData, setPagingData] = useState({
        ...initialPagingData,
    } as IPagingData);

    const request: IGetPagedDoctorsRequest = {
        currentPage: pagingData.currentPage,
        pageSize: pagingData.pageSize,
        ...filters,
    };

    const query = useQuery<IDoctorInformationResponse[], AxiosError, IDoctorInformationResponse[], QueryKey>({
        queryKey: [DoctorsQueries.getDoctors, { ...request }],
        queryFn: async () => {
            const { items, ...paging } = await DoctorsService.getPaged(request);
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
