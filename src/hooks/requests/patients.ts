import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../routes/AppRoutes';
import { PatientsQueries } from '../../constants/QueryKeys';
import { IPagedResponse } from '../../types/common/Responses';
import { IGetPagedPatientsRequest } from '../../types/request/patients';
import { IPatientInformationResponse } from '../../types/response/patients';
import { usePatientsService } from '../services/usePatientsService';

export const usePagedPatientsQuery = (request: IGetPagedPatientsRequest, enabled = false) => {
    const patientsService = usePatientsService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IPagedResponse<IPatientInformationResponse>, AxiosError, IPagedResponse<IPatientInformationResponse>, QueryKey>({
        queryKey: [PatientsQueries.getPaged, { ...request }],
        queryFn: async () => await patientsService.getPaged(request),
        enabled: enabled,
        retry: false,
        keepPreviousData: true,
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                enqueueSnackbar('Something went wrong.', {
                    variant: 'error',
                });
            }
        },
    });
};
