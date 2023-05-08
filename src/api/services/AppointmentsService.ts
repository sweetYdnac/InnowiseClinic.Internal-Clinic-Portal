import { INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { IGetAppointmentsRequest } from '../../types/request/AppointmentsAPI_requests';
import { IAppointmentResponse } from '../../types/response/AppointmentsAPI_responses';
import { getQueryString } from '../../utils/functions';
import axiosInstance from '../axiosConfig';

const getAppointments = async (request: IGetAppointmentsRequest) => {
    const queryString = '/appointments?' + getQueryString(request);

    return (await axiosInstance.get<IPagedResponse<IAppointmentResponse>>(queryString)).data;
};

const cancelAppointment = async (id: string) => (await axiosInstance.delete<INoContentResponse>(`/appointments/${id}`)).data;

const approveAppointment = async (id: string) => (await axiosInstance.patch<INoContentResponse>(`/appointments/${id}`)).data;

const AppointmentsService = {
    getAppointments,
    cancelAppointment,
    approveAppointment,
};

export default AppointmentsService;
