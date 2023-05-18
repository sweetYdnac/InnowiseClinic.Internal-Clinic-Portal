import { IPagedResponse } from '../common/Responses';
import { IGetPagedServicesRequest } from '../request/services';
import { IServiceInformationResponse } from '../response/services';

export interface IServicesService {
    getPaged: (request: IGetPagedServicesRequest) => Promise<IPagedResponse<IServiceInformationResponse>>;
}
