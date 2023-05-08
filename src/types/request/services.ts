import { IPagedRequest } from '../common/Requests';

export interface IGetPagedServicesRequest extends IPagedRequest {
    isActive: boolean;
    title?: string;
    specializationId?: string;
    categoryId?: string;
}
