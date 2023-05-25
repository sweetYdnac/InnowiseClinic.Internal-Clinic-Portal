import { IEmployeeProfile } from '../common/Responses';

export interface IReceptionistsResponse extends IEmployeeProfile {
    status: number;
}

export interface IReceptionistsInformationResponse {
    id: string;
    fullName: string;
    officeAddress: string;
    status: number;
}
