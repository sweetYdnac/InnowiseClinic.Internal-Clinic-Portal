export interface IServiceCategoryResponse {
    id: string;
    title: string;
    timeSlotSize: number;
}

export interface IGetServiceCategoriesResponse {
    categories: IServiceCategoryResponse[];
}
