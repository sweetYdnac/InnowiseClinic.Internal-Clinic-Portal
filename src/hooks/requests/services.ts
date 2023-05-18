import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { ServicesService } from '../../api/services/ServicesService';
import { AppRoutes } from '../../constants/AppRoutes';
import { ServicesQueries } from '../../constants/QueryKeys';
import { IPagedResponse } from '../../types/common/Responses';
import { IGetPagedServicesRequest } from '../../types/request/services';
import { IServiceInformationResponse } from '../../types/response/services';

export const usePagedServicesQuery = (request: IGetPagedServicesRequest, enabled = false) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { specializationId, ...rest } = request;

    return useQuery<IPagedResponse<IServiceInformationResponse>, AxiosError, IPagedResponse<IServiceInformationResponse>, QueryKey>({
        queryKey: [ServicesQueries.getPaged, { ...rest }],
        queryFn: async () => await ServicesService.getPaged(request),
        enabled: enabled,
        retry: false,
        keepPreviousData: true,
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                enqueueSnackbar('Something went wrong.', {
                    variant: 'error',
                });
            }
        },
    });
};
