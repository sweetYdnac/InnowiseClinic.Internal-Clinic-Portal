import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { IReceptionistsResponse } from '../../types/response/receptionists';
import { IReceptionistsService } from '../../types/services/IReceptionistsService';
import { axiosInstance } from './axiosConfig';

export const useReceptionistService = () =>
    ({
        getById: async (id: string) => {
            return (await axiosInstance.get<IReceptionistsResponse>(`${ApiBaseUrls.Receptionists}/${id}`)).data;
        },
    } as IReceptionistsService);
