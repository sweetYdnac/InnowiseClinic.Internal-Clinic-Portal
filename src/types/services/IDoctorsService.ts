import { AxiosResponse } from 'axios';
import { IChangeStatusRequest } from '../common/Requests';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../common/Responses';
import { ICreateDoctorRequest, IGetDoctorScheduleRequest, IGetPagedDoctorsRequest, IUpdateDoctorRequest } from '../request/doctors';
import { IDoctorResponse, IDoctorScheduledAppointmentResponse, IPagedDoctorsResponse } from '../response/doctors';

export interface IDoctorsService {
    getById: (id: string) => Promise<IDoctorResponse>;
    getPaged: (data: IGetPagedDoctorsRequest) => Promise<IPagedDoctorsResponse>;
    getSchedule: (id: string, data: IGetDoctorScheduleRequest) => Promise<IPagedResponse<IDoctorScheduledAppointmentResponse>>;
    create: (data: ICreateDoctorRequest) => Promise<ICreatedResponse>;
    update: (id: string, data: IUpdateDoctorRequest) => Promise<INoContentResponse>;
    changeStatus: (id: string, data: IChangeStatusRequest) => Promise<AxiosResponse<INoContentResponse, any>>;
}
