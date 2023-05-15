import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DoctorsService } from '../api/services/DoctorsService';
import { AppRoutes } from '../constants/AppRoutes';
import { dateApiFormat } from '../constants/formats';
import { DoctorsQueries } from '../constants/queries';
import { IChangeStatusRequest } from '../types/common/Requests';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../types/common/Responses';
import { ICreateDoctorRequest, IGetPagedDoctorsRequest } from '../types/request/doctors';
import { IDoctorInformationResponse } from '../types/response/doctors';
import { showPopup } from '../utils/functions';
import { ICreateDoctorForm } from './validators/doctors/createDoctor';

export const usePagedDoctorsQuery = (request: IGetPagedDoctorsRequest, enabled = false) => {
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

export const useChangeDoctorStatusCommand = () => {
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

export const useCreateDoctorCommand = (form: ICreateDoctorForm, setError: UseFormSetError<ICreateDoctorForm>) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation<ICreatedResponse, AxiosError<any, any>, { accountId: string; photoId: string | null }>({
        mutationFn: async ({ accountId, photoId }) => {
            const request: ICreateDoctorRequest = {
                id: accountId,
                photoId: photoId,
                firstName: form.firstName,
                lastName: form.lastName,
                middleName: form.middleName,
                dateOfBirth: form.dateOfBirth?.format(dateApiFormat) ?? '',
                specializationId: form.specializationId,
                officeId: form.officeId,
                careerStartYear: form.careerStartYear?.year() ?? 0,
                specializationName: form.specializationInput,
                officeAddress: form.officeInput,
                status: form.status,
            };

            return await DoctorsService.create(request);
        },
        onSuccess: () => {
            queryClient.invalidateQueries([DoctorsQueries.getPaged]);
            navigate(AppRoutes.Doctors);
            showPopup('Doctor created successfully!', 'success');
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('firstName', {
                    message: error.response.data.errors?.FirstName?.[0] || error.response.data.Message || '',
                });
                setError('lastName', {
                    message: error.response.data.errors?.LastName?.[0] || error.response.data.Message || '',
                });
                setError('dateOfBirth', {
                    message: error.response.data.errors?.DateOfBirth?.[0] || error.response.data.Message || '',
                });
                setError('careerStartYear', {
                    message: error.response.data.errors?.CareerStartYear?.[0] || error.response.data.Message || '',
                });
                setError('specializationId', {
                    message:
                        error.response.data.errors?.SpecializationId?.[0] ||
                        error.response.data.errors?.SpecializationName?.[0] ||
                        error.response.data.Message ||
                        '',
                });
                setError('officeId', {
                    message:
                        error.response.data.errors?.OfficeId?.[0] ||
                        error.response.data.errors?.OfficeAddress?.[0] ||
                        error.response.data.Message ||
                        '',
                });
                setError('status', {
                    message: error.response.data.errors?.Status?.[0] || error.response.data.Message || '',
                });
            }
        },
    });
};
