export interface IPagingData {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface IPagedResponse<T> extends IPagingData {
    items: T[];
}

export interface ICreatedResponse {
    id: string;
}
