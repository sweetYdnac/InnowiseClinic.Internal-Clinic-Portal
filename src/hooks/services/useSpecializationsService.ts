import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { IPagedResponse } from '../../types/common/Responses';
import { IGetPagedSpecializationsRequest } from '../../types/request/specializations';
import { ISpecializationResponse } from '../../types/response/specializations';
import { ISpecializationsService } from '../../types/services/ISpecializationsService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const useSpecializationsService = () =>
    ({
        getById: async (id: string) => {
            return (await axiosInstance.get<ISpecializationResponse>(`${ApiBaseUrls.Specializations}/${id}`)).data;
        },

        getPaged: async (data: IGetPagedSpecializationsRequest) => {
            const path = `${ApiBaseUrls.Specializations}?${getQueryString(data)}`;

            return (await axiosInstance.get<IPagedResponse<ISpecializationResponse>>(path)).data;
        },
    } as ISpecializationsService);
