import { IPagedRequest } from '../common/Requests';

export interface IGetPagedOfficesRequest extends IPagedRequest {
    isActive: boolean | null;
}
