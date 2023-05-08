import { IPagedRequest } from '../common/Requests';

export interface IGetAppointmentsRequest extends IPagedRequest {
    date: string;
    doctorFullName: string;
    serviceId: string;
    officeId: string;
    isApproved: boolean | null;
}
