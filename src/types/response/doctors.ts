import { IPagedResponse, IProfile } from '../common/Responses';

export interface IDoctorResponse extends IProfile {
    dateOfBirth: string;
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
    status: number;
    photoId: string;
}

export interface IPagedDoctorsResponse extends IPagedResponse<IDoctorInformationResponse> {}
