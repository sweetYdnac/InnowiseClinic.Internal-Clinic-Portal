import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { OfficesService } from '../../api/services/OfficesService';
import { AppRoutes } from '../../constants/AppRoutes';
import { OfficesQueries } from '../../constants/QueryKeys';
import { IPagedResponse } from '../../types/common/Responses';
import { IGetPagedOfficesRequest } from '../../types/request/offices';
import { IOfficeInformationResponse } from '../../types/response/offices';
import { showPopup } from '../../utils/functions';

export const usePagedOfficesQuery = (request: IGetPagedOfficesRequest, enabled = false) => {
    const navigate = useNavigate();

    return useQuery<IPagedResponse<IOfficeInformationResponse>, AxiosError, IPagedResponse<IOfficeInformationResponse>, QueryKey>({
        initialData: enabled ? undefined : ({ items: [] as IOfficeInformationResponse[] } as IPagedResponse<IOfficeInformationResponse>),
        queryKey: [OfficesQueries.getPaged, { ...request }],
        queryFn: async () => await OfficesService.getPaged(request),
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
