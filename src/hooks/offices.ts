import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ValidationError } from 'yup';
import { OfficesService } from '../api/services/OfficesService';
import { AppRoutes } from '../constants/AppRoutes';
import { OfficesQueries } from '../constants/queries';
import { IPagedResponse } from '../types/common/Responses';
import { IGetPagedOfficesRequest } from '../types/request/offices';
import { IOfficeInformationResponse } from '../types/response/offices';
import { showPopup } from '../utils/functions';
import { useGetPagedOfficesValidator } from './validators/offices/getPaged';

export const usePagedOfficesQuery = (request: IGetPagedOfficesRequest, enabled = false) => {
    const navigate = useNavigate();
    const { validationScheme } = useGetPagedOfficesValidator();

    return useQuery<IPagedResponse<IOfficeInformationResponse> | void, AxiosError, IPagedResponse<IOfficeInformationResponse>, QueryKey>({
        initialData: enabled ? undefined : ({ items: [] as IOfficeInformationResponse[] } as IPagedResponse<IOfficeInformationResponse>),
        queryKey: [OfficesQueries.getPaged, { ...request }],
        queryFn: async () => {
            try {
                await validationScheme.validate(request);

                return await OfficesService.getPaged(request);
            } catch (error) {
                if (error instanceof ValidationError) {
                    navigate(AppRoutes.Home);
                    showPopup('Something went wrong.');
                }
            }
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
};
