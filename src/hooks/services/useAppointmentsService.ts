import dayjs from 'dayjs';
import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { dateApiFormat, timeApiFormat } from '../../constants/Formats';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import {
    ICreateAppointmentRequest,
    IGetAppointmentsRequest,
    IGetPatientHistoryRequest,
    IGetTimeSlotsRequest,
    IRescheduleAppointmentRequest,
} from '../../types/request/appointments';
import {
    IAppointmentHistoryResponse,
    IAppointmentResponse,
    IRescheduleAppointmentResponse,
    ITimeSlotsResponse,
} from '../../types/response/appointments';
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

        getPatientHistory: async (patientId: string, request: IGetPatientHistoryRequest) => {
            const path = `${ApiBaseUrls.Patients}/${patientId}${ApiBaseUrls.Appointments}?${getQueryString(request)}`;
            const response = (await axiosInstance.get<IPagedResponse<IAppointmentHistoryResponse>>(path)).data;

            return {
                ...response,
                items: response.items.map((item) => ({
                    ...item,
                    date: dayjs(item.date, dateApiFormat),
                    startTime: dayjs(item.startTime, timeApiFormat),
                    endTime: dayjs(item.endTime, timeApiFormat),
                })),
            };
        },

        create: async (request: ICreateAppointmentRequest) =>
            (await axiosInstance.post<ICreatedResponse>(ApiBaseUrls.Appointments, request)).data,

        reschedule: async (id: string, request: IRescheduleAppointmentRequest) =>
            (await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.Appointments}/${id}`, request)).data,

        approve: async (id: string) => (await axiosInstance.patch<INoContentResponse>(`${ApiBaseUrls.Appointments}/${id}`)).data,

        cancel: async (id: string) => (await axiosInstance.delete<INoContentResponse>(`${ApiBaseUrls.Appointments}/${id}`)).data,
    } as IAppointmentsService;
};
