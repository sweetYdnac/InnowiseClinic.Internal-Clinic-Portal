import { IPagedResponse } from '../common/Responses';

export interface IOfficeResponse {
    photoId: string | null;
    address: string;
    registryPhoneNumber: string;
    isActive: boolean;
}

export interface IOfficeInformationResponse {
    id: string;
    address: string;
    registryPhoneNumber: string;
    isActive: boolean;
}

export interface IPagedOfficeResponse extends IPagedResponse<IOfficeInformationResponse> {}
