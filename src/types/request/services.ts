import { IPagedRequest } from '../common/Requests';

export interface IGetPagedServicesFilters {
    isActive: boolean;
    title?: string;
    specializationId?: string;
    categoryId?: string;
}

export interface IGetPagedServicesRequest extends IPagedRequest, IGetPagedServicesFilters {}
