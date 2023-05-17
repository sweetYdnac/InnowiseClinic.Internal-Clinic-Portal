import { IPagedRequest } from '../common/Requests';

export interface IGetPagedDoctorsRequest extends IPagedRequest {
    onlyAtWork: boolean;
    officeId?: string | null;
    specializationId?: string | null;
    fullName?: string;
}
export interface ICreateDoctorRequest {
    id: string;
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    officeId: string;
    officeAddress: string;
    dateOfBirth: string;
    specializationId: string;
    specializationName: string;
    careerStartYear: number;
    status: number;
}

export interface IUpdateDoctorRequest {
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    officeId: string;
    officeAddress: string;
    dateOfBirth: string;
    specializationId: string;
    specializationName: string;
    careerStartYear: number;
    status: number;
}
