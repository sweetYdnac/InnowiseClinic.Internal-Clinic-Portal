import { QueryKey, useQuery } from '@tanstack/react-query';
import ServicesService from '../../api/services/ServicesService';
import { IGetPagedServicesRequest } from '../../types/request/ServicesAPI';
import { IServiceInformationResponse } from '../../types/response/ServicesAPI';
import { getPagedServicesPagingDefaults } from './constants';

export function usePagedServices(title: string) {
    return useQuery<IServiceInformationResponse[], Error, IServiceInformationResponse[], QueryKey>({
        queryKey: ['getServices', { ...getPagedServicesPagingDefaults, title: title }],
        queryFn: async () => {
            const request: IGetPagedServicesRequest = {
                ...getPagedServicesPagingDefaults,
                title: title,
                isActive: true,
            };

            return (await ServicesService.getPaged(request)).items;
        },
        enabled: true,
        retry: false,
    });
}
