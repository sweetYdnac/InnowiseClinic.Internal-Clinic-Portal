import { IPagedRequest } from '../common/Requests';

export interface IGetPagedOfficesFilters {
    isActive: boolean | null;
}

export interface IGetPagedOfficesRequest extends IPagedRequest, IGetPagedOfficesFilters {}
