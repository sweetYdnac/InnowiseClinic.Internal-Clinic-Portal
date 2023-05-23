import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../common/Responses';
import { ICreateSpecializationRequest, IGetPagedSpecializationsRequest, IUpdateSpecializationRequest } from '../request/specializations';
import { ISpecializationResponse } from '../response/specializations';

export interface ISpecializationsService {
    getById: (id: string) => Promise<ISpecializationResponse>;
    getPaged: (data: IGetPagedSpecializationsRequest) => Promise<IPagedResponse<ISpecializationResponse>>;
    create: (data: ICreateSpecializationRequest) => Promise<ICreatedResponse>;
    update: (id: string, data: IUpdateSpecializationRequest) => Promise<INoContentResponse>;
    changeStatus: (id: string, isActive: boolean) => Promise<INoContentResponse>;
}
