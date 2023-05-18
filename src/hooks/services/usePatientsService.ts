import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { IGetPagedPatientsRequest } from '../../types/request/patients';
import { IPagedPatientResponse } from '../../types/response/patients';
import { IPatientsService } from '../../types/services/IPatientsService';
import { getQueryString } from '../../utils/functions';
import { axiosInstance } from './axiosConfig';

export const usePatientsService = () =>
    ({
        getPaged: async (request: IGetPagedPatientsRequest) => {
            const path = `${ApiBaseUrls.Patients}?${getQueryString(request)}`;

            return (await axiosInstance.get<IPagedPatientResponse>(path)).data;
        },
    } as IPatientsService);
