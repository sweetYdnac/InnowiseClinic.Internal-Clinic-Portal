import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ServicesService } from '../api/services/ServicesService';
import { AppRoutes } from '../constants/AppRoutes';
import { ServicesQueries } from '../constants/queries';
import { IPagedResponse } from '../types/common/Responses';
import { IGetPagedServicesRequest } from '../types/request/services';
import { IServiceInformationResponse } from '../types/response/services';
import { showPopup } from '../utils/functions';

export const usePagedServices = (request: IGetPagedServicesRequest, enabled = false) => {
    const navigate = useNavigate();
    const { specializationId, ...rest } = request;

    return useQuery<IPagedResponse<IServiceInformationResponse>, AxiosError, IPagedResponse<IServiceInformationResponse>, QueryKey>({
        queryKey: [ServicesQueries.getServices, { ...rest }],
        queryFn: async () => await ServicesService.getPaged(request),
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
