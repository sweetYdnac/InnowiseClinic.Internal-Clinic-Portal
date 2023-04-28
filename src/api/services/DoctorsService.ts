import { IDoctorResponse } from '../../types/response/ProfilesAPI_responses';
import axiosInstance from '../axiosConfig';

const getById = async (id: string) => {
    return (await axiosInstance.get<IDoctorResponse>(`/doctors/${id}`)).data;
};

const DoctorsService = {
    getById,
};

export default DoctorsService;
