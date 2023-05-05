import { IPagedResponse } from '../../types/common/Responses';
import { IGetPagedServicesRequest } from '../../types/request/ServicesAPI';
import { IServiceInformationResponse } from '../../types/response/ServicesAPI';
import { getQueryString } from '../../utils/functions';
import axiosInstance from '../axiosConfig';

const getPaged = async (request: IGetPagedServicesRequest) => {
    const path = '/services?' + getQueryString(request);

    return (await axiosInstance.get<IPagedResponse<IServiceInformationResponse>>(path)).data;
};

const ServicesService = {
    getPaged,
};

export default ServicesService;
