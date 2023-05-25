import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { ICreatedResponse, INoContentResponse } from '../../types/common/Responses';
import { ICreateAppointmentResultRequest, IUpdateAppointmentResultRequest } from '../../types/request/appointmentResults';
import { IAppointmentResultResponse } from '../../types/response/appointmentResults';
import { IAppointmentResultService } from '../../types/services/IAppointmentResultService';
import { axiosInstance } from './axiosConfig';

export const useAppointmentResultsService = () =>
    ({
        getById: async (id: string) =>
            (await axiosInstance.get<IAppointmentResultResponse>(`${ApiBaseUrls.AppointmentsResult}/${id}`)).data,

        create: async (data: ICreateAppointmentResultRequest) =>
            (await axiosInstance.post<ICreatedResponse>(`${ApiBaseUrls.AppointmentsResult}`, data)).data,

        update: async (id: string, data: IUpdateAppointmentResultRequest) =>
            (await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.AppointmentsResult}/${id}`, data)).data,
    } as IAppointmentResultService);
