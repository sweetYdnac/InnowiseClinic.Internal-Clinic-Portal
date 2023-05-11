import { IReceptionistsResponse } from '../../types/response/receptionists';
import { axiosInstance } from '../axiosConfig';

const getById = async (id: string) => {
    return (await axiosInstance.get<IReceptionistsResponse>(`/receptionists/${id}`)).data;
};

export const ReceptionistsService = {
    getById,
};
