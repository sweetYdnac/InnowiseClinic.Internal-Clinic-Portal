import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { IServiceCategoryResponse } from '../../types/response/serviceCategories';
import { IServiceCategoriesService } from '../../types/services/IServiceCategoriesService';
import { axiosInstance } from './axiosConfig';

export const useServiceCategoriesService = () =>
    ({
        getById: async (id: string) => (await axiosInstance.get<IServiceCategoryResponse>(`${ApiBaseUrls.ServiceCategories}/${id}`)).data,

        getAll: async () => (await axiosInstance.get<IServiceCategoryResponse[]>(ApiBaseUrls.ServiceCategories)).data,
    } as IServiceCategoriesService);
