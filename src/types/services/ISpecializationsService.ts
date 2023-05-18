import { INoContentResponse, IPagedResponse } from '../common/Responses';
import { IGetPagedSpecializationsRequest } from '../request/specializations';
import { ISpecializationResponse } from '../response/specializations';

export interface ISpecializationsService {
    getById: (id: string) => Promise<ISpecializationResponse>;
    getPaged: (data: IGetPagedSpecializationsRequest) => Promise<IPagedResponse<ISpecializationResponse>>;
    changeStatus: (id: string, isActive: boolean) => Promise<INoContentResponse>;
}
