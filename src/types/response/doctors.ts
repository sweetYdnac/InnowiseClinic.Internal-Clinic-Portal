import { IPagedResponse, IEmployeeProfile } from '../common/Responses';

export interface IDoctorResponse extends IEmployeeProfile {
    dateOfBirth: string;
    specializationId: string;
    specializationName: string;
    careerStartYear: number;
    status: number;
}

export interface IDoctorInformationResponse {
    id: string;
    fullName: string;
    specializationId: string;
    specializationName: string;
    officeId: string;
    officeAddress: string;
    experience: number;
    dateOfBirth: string;
    status: number;
    photoId: string;
}

export interface IPagedDoctorsResponse extends IPagedResponse<IDoctorInformationResponse> {}
