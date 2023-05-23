import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { ICreateServiceRequest, IGetPagedServicesRequest, IUpdateServiceRequest } from '../../types/request/services';
import { IServiceInformationResponse, IServiceResponse } from '../../types/response/services';
import { IServicesService } from '../../types/services/IServicesService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const useServicesService = () =>
    ({
        getById: async (id: string) => (await axiosInstance.get<IServiceResponse>(`${ApiBaseUrls.Services}/${id}`)).data,

        getPaged: async (request: IGetPagedServicesRequest) => {
            const path = `${ApiBaseUrls.Services}?${getQueryString(request)}`;

            return (await axiosInstance.get<IPagedResponse<IServiceInformationResponse>>(path)).data;
        },

        create: async (request: ICreateServiceRequest) => (await axiosInstance.post<ICreatedResponse>(ApiBaseUrls.Services, request)).data,

        update: async (id: string, request: IUpdateServiceRequest) =>
            (await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.Services}/${id}`, request)).data,

        changeStatus: async (id: string, isActive: boolean) =>
            (await axiosInstance.patch<INoContentResponse>(`${ApiBaseUrls.Services}/${id}?isActive=${isActive}`)).data,
    } as IServicesService);
