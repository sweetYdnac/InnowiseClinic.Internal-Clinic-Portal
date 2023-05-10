import { IPagedRequest } from '../common/Requests';

export interface IGetPagedDoctorsFiltes {
    onlyAtWork: boolean;
    officeId: string | null;
    specializationId: string | null;
    fullName?: string;
}

export interface IGetPagedDoctorsRequest extends IPagedRequest, IGetPagedDoctorsFiltes {}
