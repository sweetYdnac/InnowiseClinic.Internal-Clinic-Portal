import { IChangeStatusRequest } from '../../types/common/Requests';
import { ICreatedResponse, INoContentResponse } from '../../types/common/Responses';
import { ICreateDoctorRequest, IGetPagedDoctorsRequest, IUpdateDoctorRequest } from '../../types/request/doctors';
import { IDoctorResponse, IPagedDoctorsResponse } from '../../types/response/doctors';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from '../axiosConfig';

const getById = async (id: string) => {
    return (await axiosInstance.get<IDoctorResponse>(`/doctors/${id}`)).data;
};

const getPaged = async (data: IGetPagedDoctorsRequest) => {
    const path = '/doctors?' + getQueryString(data);

    return (await axiosInstance.get<IPagedDoctorsResponse>(path)).data;
};

const changeStatus = async (id: string, data: IChangeStatusRequest) =>
    await axiosInstance.patch<INoContentResponse>(`/doctors/${id}`, data);

const create = async (data: ICreateDoctorRequest) => (await axiosInstance.post<ICreatedResponse>('/doctors', data)).data;

const update = async (id: string, data: IUpdateDoctorRequest) => (await axiosInstance.put<INoContentResponse>(`/doctors/${id}`, data)).data;

export const DoctorsService = {
    getById,
    getPaged,
    changeStatus,
    create,
    update,
};
