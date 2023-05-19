import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../common/Responses';
import { ICreateServiceRequest, IGetPagedServicesRequest, IUpdateServiceRequest } from '../request/services';
import { IServiceInformationResponse, IServiceResponse } from '../response/services';

export interface IServicesService {
    getById: (id: string) => Promise<IServiceResponse>;
    getPaged: (request: IGetPagedServicesRequest) => Promise<IPagedResponse<IServiceInformationResponse>>;
    create: (request: ICreateServiceRequest) => Promise<ICreatedResponse>;
    update: (id: string, request: IUpdateServiceRequest) => Promise<INoContentResponse>;
    changeStatus: (id: string, isActive: boolean) => Promise<INoContentResponse>;
}
