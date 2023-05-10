import { IPagedRequest } from '../common/Requests';

export interface IGetPagedSpecializationsFilters {
    isActive: boolean;
    title?: string;
}

export interface IGetPagedSpecializationsRequest extends IPagedRequest {}
