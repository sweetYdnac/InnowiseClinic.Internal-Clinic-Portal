import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { IPagedResponse } from '../../types/common/Responses';
import { IGetPagedServicesRequest } from '../../types/request/services';
import { IServiceInformationResponse } from '../../types/response/services';
import { IServicesService } from '../../types/services/IServicesService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const useServicesService = () =>
    ({
        getPaged: async (request: IGetPagedServicesRequest) => {
            const path = `${ApiBaseUrls.Services}?${getQueryString(request)}`;

            return (await axiosInstance.get<IPagedResponse<IServiceInformationResponse>>(path)).data;
        },
    } as IServicesService);
