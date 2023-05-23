import { ICreatedResponse, INoContentResponse } from '../common/Responses';
import { ICreateOfficeRequest, IGetPagedOfficesRequest, IUpdateOfficeRequest } from '../request/offices';
import { IOfficeResponse, IPagedOfficeResponse } from '../response/offices';

export interface IOfficesService {
    getById: (id: string) => Promise<IOfficeResponse>;
    getPaged: (request: IGetPagedOfficesRequest) => Promise<IPagedOfficeResponse>;
    create: (data: ICreateOfficeRequest) => Promise<ICreatedResponse>;
    update: (id: string, data: IUpdateOfficeRequest) => Promise<INoContentResponse>;
    changeStatus: (id: string, isActive: boolean) => Promise<INoContentResponse>;
}
