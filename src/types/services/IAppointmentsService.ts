import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../common/Responses';
import {
    ICreateAppointmentRequest,
    IGetAppointmentsRequest,
    IGetPatientHistoryRequest,
    IGetTimeSlotsRequest,
    IRescheduleAppointmentRequest,
} from '../request/appointments';
import {
    IAppointmentHistoryResponse,
    IAppointmentResponse,
    IRescheduleAppointmentResponse,
    ITimeSlotsResponse,
} from '../response/appointments';

export interface IAppointmentsService {
    getById: (id: string) => Promise<IRescheduleAppointmentResponse>;
    getPaged: (request: IGetAppointmentsRequest) => Promise<IPagedResponse<IAppointmentResponse>>;
    getTimeSlots: (request: IGetTimeSlotsRequest) => Promise<ITimeSlotsResponse>;
    getPatientHistory: (patientId: string, request: IGetPatientHistoryRequest) => Promise<IPagedResponse<IAppointmentHistoryResponse>>;
    create: (request: ICreateAppointmentRequest) => Promise<ICreatedResponse>;
    reschedule: (id: string, request: IRescheduleAppointmentRequest) => Promise<INoContentResponse>;
    approve: (id: string) => Promise<INoContentResponse>;
    cancel: (id: string) => Promise<INoContentResponse>;
}
