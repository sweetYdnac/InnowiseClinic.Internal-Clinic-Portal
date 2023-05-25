import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { IChangeStatusRequest } from '../../types/common/Requests';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import {
    ICreateDoctorRequest,
    IGetDoctorScheduleRequest,
    IGetPagedDoctorsRequest,
    IUpdateDoctorRequest,
} from '../../types/request/doctors';
import { IDoctorResponse, IDoctorScheduledAppointmentResponse, IPagedDoctorsResponse } from '../../types/response/doctors';
import { IDoctorsService } from '../../types/services/IDoctorsService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const useDoctorsService = () =>
    ({
        getById: async (id: string) => {
            return (await axiosInstance.get<IDoctorResponse>(`${ApiBaseUrls.Doctors}/${id}`)).data;
        },

        getPaged: async (data: IGetPagedDoctorsRequest) =>
            (await axiosInstance.get<IPagedDoctorsResponse>(`${ApiBaseUrls.Doctors}?${getQueryString(data)}`)).data,

        getSchedule: async (id: string, data: IGetDoctorScheduleRequest) => {
            const path = `${ApiBaseUrls.Doctors}/${id}${ApiBaseUrls.Appointments}?${getQueryString(data)}`;

            return (await axiosInstance.get<IPagedResponse<IDoctorScheduledAppointmentResponse>>(path)).data;
        },

        create: async (data: ICreateDoctorRequest) => (await axiosInstance.post<ICreatedResponse>(ApiBaseUrls.Doctors, data)).data,

        update: async (id: string, data: IUpdateDoctorRequest) =>
            (await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.Doctors}/${id}`, data)).data,

        changeStatus: async (id: string, data: IChangeStatusRequest) =>
            await axiosInstance.patch<INoContentResponse>(`${ApiBaseUrls.Doctors}/${id}`, data),
    } as IDoctorsService);
