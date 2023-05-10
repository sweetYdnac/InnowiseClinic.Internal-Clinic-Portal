import { IPagedRequest } from '../common/Requests';

export interface IGetAppointmentsRequest extends IPagedRequest {
    date: string;
    doctorFullName: string;
    serviceId: string;
    officeId: string;
    isApproved: boolean | null;
}

export interface IGetTimeSlotsRequest {
    date: string;
    doctors: string[];
    duration: number;
    startTime: string;
    endTime: string;
}
