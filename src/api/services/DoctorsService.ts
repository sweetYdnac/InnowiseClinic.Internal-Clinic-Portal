import { IGetPagedDoctorsRequest } from '../../types/request/doctors';
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

export const DoctorsService = {
    getById,
    getPaged,
};
