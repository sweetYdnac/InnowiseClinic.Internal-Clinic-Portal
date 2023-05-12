import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { PatientsService } from '../api/services/PatientsService';
import { AppRoutes } from '../constants/AppRoutes';
import { PatientsQueries } from '../constants/queries';
import { IPagedResponse } from '../types/common/Responses';
import { IGetPagedPatientsRequest } from '../types/request/patients';
import { IPatientInformationResponse } from '../types/response/patients';
import { showPopup } from '../utils/functions';

export const usePagedPatients = (request: IGetPagedPatientsRequest, enabled = false) => {
    const navigate = useNavigate();

    return useQuery<IPagedResponse<IPatientInformationResponse>, AxiosError, IPagedResponse<IPatientInformationResponse>, QueryKey>({
        queryKey: [PatientsQueries.getPatients, { ...request }],
        queryFn: async () => await PatientsService.getPaged(request),
        enabled: enabled,
        retry: false,
        keepPreviousData: true,
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                showPopup('Something went wrong.');
            }
        },
    });
};
