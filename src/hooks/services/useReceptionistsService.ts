import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { IChangeStatusRequest } from '../../types/common/Requests';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { ICreateReceptionistRequest, IGetPagedReceptionistsRequest, IUpdateReceptionistRequest } from '../../types/request/receptionists';
import { IReceptionistsInformationResponse, IReceptionistsResponse } from '../../types/response/receptionists';
import { IReceptionistsService } from '../../types/services/IReceptionistsService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const useReceptionistService = () =>
    ({
        getById: async (id: string) => (await axiosInstance.get<IReceptionistsResponse>(`${ApiBaseUrls.Receptionists}/${id}`)).data,

        getPaged: async (request: IGetPagedReceptionistsRequest) =>
            (
                await axiosInstance.get<IPagedResponse<IReceptionistsInformationResponse>>(
                    `${ApiBaseUrls.Receptionists}?${getQueryString(request)}`
                )
            ).data,

        remove: async (id: string) => (await axiosInstance.delete<INoContentResponse>(`${ApiBaseUrls.Receptionists}/${id}`)).data,

        create: async (data: ICreateReceptionistRequest) =>
            (await axiosInstance.post<ICreatedResponse>(ApiBaseUrls.Receptionists, data)).data,

        update: async (id: string, data: IUpdateReceptionistRequest) =>
            (await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.Receptionists}/${id}`, data)).data,

        changeStatus: async (id: string, request: IChangeStatusRequest) =>
            (await axiosInstance.patch<INoContentResponse>(`${ApiBaseUrls.Receptionists}/${id}`, request)).data,
    } as IReceptionistsService);
