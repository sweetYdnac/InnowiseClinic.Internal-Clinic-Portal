import { IPagedRequest } from '../common/Requests';

export interface IGetPagedReceptionistsRequest extends IPagedRequest {}

export interface IUpdateReceptionistRequest {
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    officeId: string;
    officeAddress: string;
    status: number;
}

export interface ICreateReceptionistRequest extends IUpdateReceptionistRequest {
    id: string;
    email: string;
    password: string;
}
