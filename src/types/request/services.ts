import { IPagedRequest } from '../common/Requests';

export interface IGetPagedServicesRequest extends IPagedRequest {
    isActive: boolean | null;
    title?: string;
    specializationId?: string;
    categoryId?: string;
}

export interface ICreateServiceRequest {
    title: string;
    price: number;
    specializationId: string;
    categoryId: string;
    isActive: boolean;
}

export interface IUpdateServiceRequest extends ICreateServiceRequest {
    timeSlotSize: number;
}
