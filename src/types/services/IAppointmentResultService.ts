import { ICreatedResponse, INoContentResponse } from '../common/Responses';
import { ICreateAppointmentResultRequest, IUpdateAppointmentResultRequest } from '../request/appointmentResults';
import { IAppointmentResultResponse } from '../response/appointmentResults';

export interface IAppointmentResultService {
    getById: (id: string) => Promise<IAppointmentResultResponse>;
    create: (data: ICreateAppointmentResultRequest) => Promise<ICreatedResponse>;
    update: (id: string, data: IUpdateAppointmentResultRequest) => Promise<INoContentResponse>;
}
