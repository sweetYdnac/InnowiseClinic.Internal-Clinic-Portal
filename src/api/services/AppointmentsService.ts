import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { ICreateAppointmentRequest, IGetAppointmentsRequest, IGetTimeSlotsRequest } from '../../types/request/appointments';
import { IAppointmentResponse, IRescheduleAppointmentResponse, ITimeSlotsResponse } from '../../types/response/appointments';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from '../axiosConfig';

const getById = async (id: string) => (await axiosInstance.get<IRescheduleAppointmentResponse>(`/appointments/${id}`)).data;

const getPaged = async (request: IGetAppointmentsRequest) => {
    const queryString = '/appointments?' + getQueryString(request);

    return (await axiosInstance.get<IPagedResponse<IAppointmentResponse>>(queryString)).data;
};

const getTimeSlots = async (request: IGetTimeSlotsRequest) => {
    const path = 'appointments/timeslots?' + getQueryString(request);

    return (await axiosInstance.get<ITimeSlotsResponse>(path)).data;
};

const cancel = async (id: string) => (await axiosInstance.delete<INoContentResponse>(`/appointments/${id}`)).data;

const approve = async (id: string) => (await axiosInstance.patch<INoContentResponse>(`/appointments/${id}`)).data;

const create = async (request: ICreateAppointmentRequest) => (await axiosInstance.post<ICreatedResponse>('/appointments', request)).data;

export const AppointmentsService = {
    getById,
    getPaged,
    getTimeSlots,
    cancel,
    approve,
    create,
};
