import IPagedRequest from '../common/requests/IPagedRequest';

export interface IGetAppointmentsRequest extends IPagedRequest {
    date: string;
    doctorFullName: string;
    serviceName: string;
    officeId: string;
    isApproved: boolean | null;
}
