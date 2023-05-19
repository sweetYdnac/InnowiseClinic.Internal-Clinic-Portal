export interface IServiceResponse {
    title: string;
    price: number;
    categoryId: string;
    categoryTitle: string;
    isActive: boolean;
}

export interface IServiceInformationResponse {
    id: string;
    title: string;
    price: number;
    categoryId: string;
    categoryTitle: string;
    duration: number;
    specializationId: string;
    isActive: boolean;
}
