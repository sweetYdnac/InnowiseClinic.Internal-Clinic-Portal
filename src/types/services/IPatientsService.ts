import { IGetPagedPatientsRequest } from '../request/patients';
import { IPagedPatientResponse } from '../response/patients';

export interface IPatientsService {
    getPaged: (request: IGetPagedPatientsRequest) => Promise<IPagedPatientResponse>;
}
