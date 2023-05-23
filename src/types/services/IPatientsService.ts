import { ICreatedResponse, INoContentResponse } from '../common/Responses';
import { ICreatePatientRequest, IGetPagedPatientsRequest, IUpdatePatientRequest } from '../request/patients';
import { IPagedPatientResponse, IPatientResponse } from '../response/patients';

export interface IPatientsService {
    getById: (id: string) => Promise<IPatientResponse>;
    getPaged: (request: IGetPagedPatientsRequest) => Promise<IPagedPatientResponse>;
    create: (data: ICreatePatientRequest) => Promise<ICreatedResponse>;
    update: (id: string, data: IUpdatePatientRequest) => Promise<INoContentResponse>;
    remove: (id: string) => Promise<INoContentResponse>;
}
