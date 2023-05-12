import { IPagedRequest } from '../common/Requests';

export interface IGetPagedPatientsRequest extends IPagedRequest {
    fullName: string;
}
