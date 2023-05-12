import { QueryKey, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { DoctorsService } from '../api/services/DoctorsService';
import { AppRoutes } from '../constants/AppRoutes';
import { DoctorsQueries } from '../constants/queries';
import { IPagedResponse } from '../types/common/Responses';
import { IGetPagedDoctorsRequest } from '../types/request/doctors';
import { IDoctorInformationResponse } from '../types/response/doctors';
import { showPopup } from '../utils/functions';

export const usePagedDoctors = (request: IGetPagedDoctorsRequest, enabled = false) => {
    const navigate = useNavigate();

    return useQuery<IPagedResponse<IDoctorInformationResponse>, AxiosError, IPagedResponse<IDoctorInformationResponse>, QueryKey>({
        queryKey: [DoctorsQueries.getDoctors, { ...request }],
        queryFn: async () => await DoctorsService.getPaged(request),
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
