import { IPagedRequest } from '../common/Requests';

export interface IGetPagedPatientsRequest extends IPagedRequest {
    fullName?: string;
}

export interface IUpdatePatientRequest {
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    phoneNumber: string;
}

export interface ICreatePatientRequest extends IUpdatePatientRequest {
    id: string;
}
