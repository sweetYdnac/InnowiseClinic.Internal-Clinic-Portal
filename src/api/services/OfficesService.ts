import { IGetPagedOfficesRequest } from '../../types/request/offices';
import { IPagedOfficeResponse } from '../../types/response/offices';
import { getQueryString } from '../../utils/functions';
import axiosInstance from '../axiosConfig';

const getPaged = async (request: IGetPagedOfficesRequest) => {
    const queryString = '/offices?' + getQueryString(request);

    return (await axiosInstance.get<IPagedOfficeResponse>(queryString)).data;
};

const OfficesService = {
    getPaged,
};

export default OfficesService;
