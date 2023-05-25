import { IBaseProfile, IPagedResponse } from '../common/Responses';

export interface IPatientResponse extends IBaseProfile {
    dateOfBirth: string;
    phoneNumber: string;
    isActive: boolean;
}

export interface IPatientInformationResponse {
    id: string;
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
}

export interface IPagedPatientResponse extends IPagedResponse<IPatientInformationResponse> {}
