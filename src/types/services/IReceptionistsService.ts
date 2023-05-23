import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../common/Responses';
import { ICreateReceptionistRequest, IGetPagedReceptionistsRequest, IUpdateReceptionistRequest } from '../request/receptionists';
import { IReceptionistsInformationResponse, IReceptionistsResponse } from '../response/receptionists';

export interface IReceptionistsService {
    getById: (id: string) => Promise<IReceptionistsResponse>;
    getPaged: (request: IGetPagedReceptionistsRequest) => Promise<IPagedResponse<IReceptionistsInformationResponse>>;
    remove: (id: string) => Promise<INoContentResponse>;
    create: (data: ICreateReceptionistRequest) => Promise<ICreatedResponse>;
    update: (id: string, data: IUpdateReceptionistRequest) => Promise<INoContentResponse>;
}
