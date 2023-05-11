import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientsService from '../api/services/PatientsService';
import { AppRoutes } from '../constants/AppRoutes';
import { PatientsQueries } from '../constants/queries';
import { IPagedRequest } from '../types/common/Requests';
import { IPagingData } from '../types/common/Responses';
import { IGetPagedPatientsFilters, IGetPagedPatientsRequest } from '../types/request/patients';
import { IPatientInformationResponse } from '../types/response/patients';
import { showPopup } from '../utils/functions';

export const usePagedPatients = (initialPagingData: IPagedRequest, filters: IGetPagedPatientsFilters, enabled = false) => {
    const navigate = useNavigate();
    const [pagingData, setPagingData] = useState({
        ...initialPagingData,
    } as IPagingData);

    const query = useQuery<IPatientInformationResponse[], AxiosError, IPatientInformationResponse[], QueryKey>({
        queryKey: [PatientsQueries.getPatients, { currentPage: pagingData.currentPage, pageSize: pagingData.pageSize }],
        queryFn: async () => {
            const request: IGetPagedPatientsRequest = {
                currentPage: pagingData.currentPage,
                pageSize: pagingData.pageSize,
                ...filters,
            };

            const { items, ...paging } = await PatientsService.getPaged(request);
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
