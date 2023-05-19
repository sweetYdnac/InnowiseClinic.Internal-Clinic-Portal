import { IServiceCategoryResponse } from '../response/serviceCategories';

export interface IServiceCategoriesService {
    getById: (id: string) => Promise<IServiceCategoryResponse>;
    getAll: () => Promise<IServiceCategoryResponse[]>;
}
