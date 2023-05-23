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

export interface INoContentResponse {}

export interface IBaseProfile {
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName: string;
}

export interface IEmployeeProfile extends IBaseProfile {
    officeId: string;
    officeAddress: string;
}
