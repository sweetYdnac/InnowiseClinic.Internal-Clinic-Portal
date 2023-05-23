import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { ICreatedResponse, INoContentResponse } from '../../types/common/Responses';
import { ICreatePatientRequest, IGetPagedPatientsRequest, IUpdatePatientRequest } from '../../types/request/patients';
import { IPagedPatientResponse, IPatientResponse } from '../../types/response/patients';
import { IPatientsService } from '../../types/services/IPatientsService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const usePatientsService = () =>
    ({
        getById: async (id: string) => (await axiosInstance.get<IPatientResponse>(`${ApiBaseUrls.Patients}/${id}`)).data,

        getPaged: async (request: IGetPagedPatientsRequest) => {
            const path = `${ApiBaseUrls.Patients}?${getQueryString(request)}`;

            return (await axiosInstance.get<IPagedPatientResponse>(path)).data;
        },

        create: async (data: ICreatePatientRequest) => (await axiosInstance.post<ICreatedResponse>(ApiBaseUrls.Patients, data)).data,

        update: async (id: string, data: IUpdatePatientRequest) =>
            (await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.Patients}/${id}`, data)).data,

        remove: async (id: string) => (await axiosInstance.delete<INoContentResponse>(`${ApiBaseUrls.Patients}/${id}`)).data,
    } as IPatientsService);
