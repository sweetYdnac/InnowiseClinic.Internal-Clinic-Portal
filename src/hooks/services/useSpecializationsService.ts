import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import {
    ICreateSpecializationRequest,
    IGetPagedSpecializationsRequest,
    IUpdateSpecializationRequest,
} from '../../types/request/specializations';
import { ISpecializationResponse } from '../../types/response/specializations';
import { ISpecializationsService } from '../../types/services/ISpecializationsService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const useSpecializationsService = () =>
    ({
        getById: async (id: string) => {
            return (await axiosInstance.get<ISpecializationResponse>(`${ApiBaseUrls.Specializations}/${id}`)).data;
        },

        getPaged: async (data: IGetPagedSpecializationsRequest) =>
            (await axiosInstance.get<IPagedResponse<ISpecializationResponse>>(`${ApiBaseUrls.Specializations}?${getQueryString(data)}`))
                .data,

        create: async (data: ICreateSpecializationRequest) =>
            (await axiosInstance.post<ICreatedResponse>(ApiBaseUrls.Specializations, data)).data,

        update: async (id: string, data: IUpdateSpecializationRequest) =>
            await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.Specializations}/${id}`, data),

        changeStatus: async (id: string, isActive: boolean) =>
            await axiosInstance.patch<INoContentResponse>(`${ApiBaseUrls.Specializations}/${id}?isActive=${isActive}`),
    } as ISpecializationsService);
