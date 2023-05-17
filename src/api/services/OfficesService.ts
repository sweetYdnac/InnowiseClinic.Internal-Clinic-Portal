import { ICreatedResponse, INoContentResponse } from '../../types/common/Responses';
import { ICreateOfficeRequest, IGetPagedOfficesRequest, IUpdateOfficeRequest } from '../../types/request/offices';
import { IOfficeResponse, IPagedOfficeResponse } from '../../types/response/offices';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from '../axiosConfig';

const baseUrl = '/offices';

const getById = async (id: string) => (await axiosInstance.get<IOfficeResponse>(`${baseUrl}/${id}`)).data;

const getPaged = async (request: IGetPagedOfficesRequest) => {
    const path = `${baseUrl}?` + getQueryString(request);

    return (await axiosInstance.get<IPagedOfficeResponse>(path)).data;
};

const create = async (data: ICreateOfficeRequest) => (await axiosInstance.post<ICreatedResponse>(`${baseUrl}`, data)).data;

const update = async (id: string, data: IUpdateOfficeRequest) =>
    (await axiosInstance.put<INoContentResponse>(`${baseUrl}/${id}`, data)).data;

const changeStatus = async (id: string, isActive: boolean) =>
    (await axiosInstance.patch<INoContentResponse>(`${baseUrl}/${id}?isActive=${isActive}`)).data;

export const OfficesService = {
    getById,
    getPaged,
    create,
    update,
    changeStatus,
};
