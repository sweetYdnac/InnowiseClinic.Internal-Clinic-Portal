import { IReceptionistsResponse } from '../../types/response/ProfilesAPI_responses';
import axiosInstance from '../axiosConfig';

const getById = async (id: string) => {
    return (await axiosInstance.get<IReceptionistsResponse>(`/receptionists/${id}`)).data;
};

const ReceptionistsService = {
    getById,
};

export default ReceptionistsService;
