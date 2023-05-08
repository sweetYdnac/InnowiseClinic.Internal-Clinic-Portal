import { IPagedResponse } from '../../types/common/Responses';
import { IGetPagedSpecializationsRequest } from '../../types/request/specializations';
import { ISpecializationResponse } from '../../types/response/specializations';
import { getQueryString } from '../../utils/functions';
import axiosInstance from '../axiosConfig';

const getPaged = async (data: IGetPagedSpecializationsRequest) => {
    const path = '/specializations?' + getQueryString(data);

    return (await axiosInstance.get<IPagedResponse<ISpecializationResponse>>(path)).data;
};

const SpecializationsService = {
    getPaged,
};

export default SpecializationsService;
