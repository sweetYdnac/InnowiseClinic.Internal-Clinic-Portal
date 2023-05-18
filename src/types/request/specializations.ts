import { IPagedRequest } from '../common/Requests';

export interface IGetPagedSpecializationsRequest extends IPagedRequest {
    isActive: boolean | null;
    title?: string;
}
