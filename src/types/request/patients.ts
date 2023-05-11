import { IPagedRequest } from '../common/Requests';

export interface IGetPagedPatientsFilters {
    fullName: string;
}

export interface IGetPagedPatientsRequest extends IPagedRequest, IGetPagedPatientsFilters {}
