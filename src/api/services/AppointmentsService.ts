import IPagedResponse from '../../types/common/responses/IPagedResponse';
import { IGetAppointmentsRequest } from '../../types/request/AppointmentsAPI_requests';
import { IAppointmentResponse } from '../../types/response/AppointmentsAPI_responses';
import { getQueryString } from '../../utils/functions';
import axiosInstance from '../axiosConfig';

const getAppointments = async (request: IGetAppointmentsRequest) => {
    const queryString = getQueryString(request);
    return (await axiosInstance.get<IPagedResponse<IAppointmentResponse>>(`/appointments?${queryString}`)).data;
};

const AppointmentsService = {
    getAppointments,
};

export default AppointmentsService;
