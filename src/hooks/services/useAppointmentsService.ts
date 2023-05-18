import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import {
    ICreateAppointmentRequest,
    IGetAppointmentsRequest,
    IGetTimeSlotsRequest,
    IRescheduleAppointmentRequest,
} from '../../types/request/appointments';
import { IAppointmentResponse, IRescheduleAppointmentResponse, ITimeSlotsResponse } from '../../types/response/appointments';
import { IAppointmentsService } from '../../types/services/IAppointmentsService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const useAppointmentsService = () => {
    return {
        getById: async (id: string) => (await axiosInstance.get<IRescheduleAppointmentResponse>(`${ApiBaseUrls.Appointments}/${id}`)).data,

        getPaged: async (request: IGetAppointmentsRequest) => {
            const queryString = `${ApiBaseUrls.Appointments}?${getQueryString(request)}`;

            return (await axiosInstance.get<IPagedResponse<IAppointmentResponse>>(queryString)).data;
        },

        getTimeSlots: async (request: IGetTimeSlotsRequest) => {
            const path = `${ApiBaseUrls.Appointments}/timeslots?${getQueryString(request)}`;

            return (await axiosInstance.get<ITimeSlotsResponse>(path)).data;
        },

        create: async (request: ICreateAppointmentRequest) =>
            (await axiosInstance.post<ICreatedResponse>(ApiBaseUrls.Appointments, request)).data,

        reschedule: async (id: string, request: IRescheduleAppointmentRequest) =>
            (await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.Appointments}/${id}`, request)).data,

        approve: async (id: string) => (await axiosInstance.patch<INoContentResponse>(`${ApiBaseUrls.Appointments}/${id}`)).data,

        cancel: async (id: string) => (await axiosInstance.delete<INoContentResponse>(`${ApiBaseUrls.Appointments}/${id}`)).data,
    } as IAppointmentsService;
};
