import { IPagedRequest } from '../common/Requests';

export interface IGetPagedOfficesRequest extends IPagedRequest {
    isActive: boolean | null;
}

export interface ICreateOfficeRequest {
    photoId: string | null;
    city: string;
    street: string;
    houseNumber: string;
    officeNumber: string;
    registryPhoneNumber: string;
    isActive: boolean;
}

export interface IUpdateOfficeRequest extends ICreateOfficeRequest {}
