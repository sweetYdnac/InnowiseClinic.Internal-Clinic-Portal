import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { ICreatedResponse, INoContentResponse } from '../../types/common/Responses';
import { ICreateOfficeRequest, IGetPagedOfficesRequest, IUpdateOfficeRequest } from '../../types/request/offices';
import { IOfficeResponse, IPagedOfficeResponse } from '../../types/response/offices';
import { IOfficesService } from '../../types/services/IOfficesService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const useOfficesService = () =>
    ({
        getById: async (id: string) => (await axiosInstance.get<IOfficeResponse>(`${ApiBaseUrls.Offices}/${id}`)).data,

        getPaged: async (request: IGetPagedOfficesRequest) =>
            (await axiosInstance.get<IPagedOfficeResponse>(`${ApiBaseUrls.Offices}?${getQueryString(request)}`)).data,

        create: async (data: ICreateOfficeRequest) => (await axiosInstance.post<ICreatedResponse>(ApiBaseUrls.Offices, data)).data,

        update: async (id: string, data: IUpdateOfficeRequest) =>
            (await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.Offices}/${id}`, data)).data,

        changeStatus: async (id: string, isActive: boolean) =>
            (await axiosInstance.patch<INoContentResponse>(`${ApiBaseUrls.Offices}/${id}?isActive=${isActive}`)).data,
    } as IOfficesService);
