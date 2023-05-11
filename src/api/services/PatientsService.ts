import { IGetPagedPatientsRequest } from '../../types/request/patients';
import { IPagedPatientResponse } from '../../types/response/patients';
import { getQueryString } from '../../utils/functions';
import axiosInstance from '../axiosConfig';

const getPaged = async (request: IGetPagedPatientsRequest) => {
    const path = '/patients?' + getQueryString(request);

    return (await axiosInstance.get<IPagedPatientResponse>(path)).data;
};

const PatientsService = {
    getPaged,
};

export default PatientsService;
