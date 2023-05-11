import { IPagedResponse } from '../common/Responses';

export interface IPatientInformationResponse {
    id: string;
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
}

export interface IPagedPatientResponse extends IPagedResponse<IPatientInformationResponse> {}
