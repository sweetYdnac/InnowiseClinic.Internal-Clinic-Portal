import { IPagedResponse } from '../../types/common/Responses';
import { IGetPagedSpecializationsRequest } from '../../types/request/specializations';
import { ISpecializationResponse } from '../../types/response/specializations';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from '../axiosConfig';

const getById = async (id: string) => {
    return (await axiosInstance.get<ISpecializationResponse>(`/specializations/${id}`)).data;
};

const getPaged = async (data: IGetPagedSpecializationsRequest) => {
    const path = '/specializations?' + getQueryString(data);

    return (await axiosInstance.get<IPagedResponse<ISpecializationResponse>>(path)).data;
};

export const SpecializationsService = {
    getById,
    getPaged,
};
