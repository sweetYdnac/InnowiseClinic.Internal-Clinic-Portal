import { INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { IGetAppointmentsRequest, IGetTimeSlotsRequest } from '../../types/request/appointments';
import { IAppointmentResponse, ITimeSlotsResponse } from '../../types/response/appointments';
import { getQueryString } from '../../utils/functions';
import axiosInstance from '../axiosConfig';

const getAppointments = async (request: IGetAppointmentsRequest) => {
    const queryString = '/appointments?' + getQueryString(request);

    return (await axiosInstance.get<IPagedResponse<IAppointmentResponse>>(queryString)).data;
};

const cancelAppointment = async (id: string) => (await axiosInstance.delete<INoContentResponse>(`/appointments/${id}`)).data;

const approveAppointment = async (id: string) => (await axiosInstance.patch<INoContentResponse>(`/appointments/${id}`)).data;

const getTimeSlots = async (data: IGetTimeSlotsRequest) => {
    const path = 'appointments/timeslots?' + getQueryString(data);

    return (await axiosInstance.get<ITimeSlotsResponse>(path)).data;
};

const AppointmentsService = {
    getAppointments,
    cancelAppointment,
    approveAppointment,
    getTimeSlots,
};

export default AppointmentsService;
