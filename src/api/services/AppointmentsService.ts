import { IPagedResponse } from '../../types/common/Responses';
import { IGetAppointmentsRequest } from '../../types/request/AppointmentsAPI_requests';
import { IAppointmentResponse } from '../../types/response/AppointmentsAPI_responses';
import { getQueryString } from '../../utils/functions';
import axiosInstance from '../axiosConfig';

const getAppointments = async (request: IGetAppointmentsRequest) => {
    const queryString = '/appointments?' + getQueryString(request);

    return (await axiosInstance.get<IPagedResponse<IAppointmentResponse>>(queryString)).data;
};

const AppointmentsService = {
    getAppointments,
};

export default AppointmentsService;
