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
    dateOfBirth: string;
    specializationId: string;
    officeId: string;
    careerStartYear: number;
    specializationName: string;
    officeAddress: string;
    status: number;
}
