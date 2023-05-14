import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { DoctorsService } from '../api/services/DoctorsService';
import { AppRoutes } from '../constants/AppRoutes';
import { DoctorsQueries } from '../constants/queries';
import { IChangeStatusRequest } from '../types/common/Requests';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../types/common/Responses';
import { ICreateDoctorRequest, IGetPagedDoctorsRequest } from '../types/request/doctors';
import { IDoctorInformationResponse } from '../types/response/doctors';
import { showPopup } from '../utils/functions';

export const usePagedDoctors = (request: IGetPagedDoctorsRequest, enabled = false) => {
    const navigate = useNavigate();

    return useQuery<IPagedResponse<IDoctorInformationResponse>, AxiosError, IPagedResponse<IDoctorInformationResponse>, QueryKey>({
        queryKey: [DoctorsQueries.getPaged, { ...request }],
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

export const useChangeDoctorStatus = () => {
    return useMutation<INoContentResponse, AxiosError, { id: string; status: number }>({
        mutationFn: async ({ id, status }) => await DoctorsService.changeStatus(id, { status: status } as IChangeStatusRequest),
        onSuccess: () => {
            showPopup('Status changed successfully!', 'success');
        },
        onError: () => {
            showPopup('Something went wrong.');
        },
    });
};

export const useCreateDoctor = (data: ICreateDoctorRequest) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation<ICreatedResponse, AxiosError, void>({
        mutationFn: async () => await DoctorsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries([DoctorsQueries.getPaged]);
            navigate(AppRoutes.Doctors);
            showPopup('Doctor created successfully!', 'success');
        },
        onError: () => {
            // setErrors
        },
    });
};
