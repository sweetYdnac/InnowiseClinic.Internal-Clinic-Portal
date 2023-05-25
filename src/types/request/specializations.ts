import { IPagedRequest } from '../common/Requests';

export interface IGetPagedSpecializationsRequest extends IPagedRequest {
    isActive: boolean | null;
    title?: string;
}

export interface ICreateSpecializationRequest {
    title: string;
    isActive: boolean;
}

export interface IUpdateSpecializationRequest extends ICreateSpecializationRequest {}
