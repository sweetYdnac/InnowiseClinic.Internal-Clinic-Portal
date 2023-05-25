import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ReceptionistsQueries } from '../../constants/QueryKeys';
import { AppRoutes } from '../../routes/AppRoutes';
import { ICreatedResponse, INoContentResponse, IPagedResponse } from '../../types/common/Responses';
import { ICreateReceptionistRequest, IGetPagedReceptionistsRequest, IUpdateReceptionistRequest } from '../../types/request/receptionists';
import { IReceptionistsInformationResponse, IReceptionistsResponse } from '../../types/response/receptionists';
import { useReceptionistService } from '../services/useReceptionistsService';
import { useCreateReceptionistValidator } from '../validators/receptionists/create';
import { IGetReceptionistsForm } from '../validators/receptionists/getPaged';
import { IUpdateReceptionistForm } from '../validators/receptionists/update';

export const useGetReceptionistByIdQuery = (id: string, enabled = false) => {
    const receptionistsService = useReceptionistService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<IReceptionistsResponse, AxiosError, IReceptionistsResponse, QueryKey>({
        queryKey: [ReceptionistsQueries.getById, id],
        queryFn: async () => await receptionistsService.getById(id),
        enabled: enabled,
        retry: false,
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

export const usePagedReceptionistsQuery = (form: IGetReceptionistsForm, enabled = false) => {
    const receptionistsService = useReceptionistService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<
        IPagedResponse<IReceptionistsInformationResponse>,
        AxiosError,
        IPagedResponse<IReceptionistsInformationResponse>,
        QueryKey
    >({
        queryKey: [ReceptionistsQueries.getPaged, { ...form }],
        queryFn: async () => await receptionistsService.getPaged({ ...form } as IGetPagedReceptionistsRequest),
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

export const useRemoveReceptionistCommand = () => {
    const receptionistsService = useReceptionistService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<INoContentResponse, AxiosError, { id: string }>({
        mutationFn: async ({ id }) => await receptionistsService.remove(id),
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.removeQueries([ReceptionistsQueries.getById, variables.id]);
            queryClient.invalidateQueries([ReceptionistsQueries.getPaged]);
            enqueueSnackbar('Receptionist removed successfully!', {
                variant: 'success',
            });
        },
        onError: () => {
            enqueueSnackbar('Something went wrong.', {
                variant: 'error',
            });
        },
    });
};

export const useUpdateReceptionistCommand = (
    id: string,
    form: IUpdateReceptionistForm,
    setError: UseFormSetError<IUpdateReceptionistForm>
) => {
    const receptionistsService = useReceptionistService();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    let request = useMemo(
        () =>
            ({
                ...form,
            } as IUpdateReceptionistRequest),
        [form]
    );

    return useMutation<INoContentResponse, AxiosError<any, any>, { photoId: string }>({
        mutationFn: async ({ photoId }) => {
            request.photoId = photoId;

            return await receptionistsService.update(id, request);
        },
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData([ReceptionistsQueries.getById, id], {
                ...request,
                photoId: variables.photoId,
            } as IReceptionistsResponse);
            queryClient.invalidateQueries([ReceptionistsQueries.getPaged]);
            enqueueSnackbar('Receptionist updated successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('firstName', {
                    message: error.response.data.errors?.FirstName?.[0] || error.response.data.Message || '',
                });
                setError('lastName', {
                    message: error.response.data.errors?.LastName?.[0] || error.response.data.Message || '',
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

export const useCreateReceptionistCommand = (form: IUpdateReceptionistForm, setError: UseFormSetError<IUpdateReceptionistForm>) => {
    const receptionistsService = useReceptionistService();
    const { createRequestValidationScheme } = useCreateReceptionistValidator();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    let request = useMemo(
        () =>
            ({
                ...form,
            } as ICreateReceptionistRequest),
        [form]
    );

    return useMutation<ICreatedResponse, AxiosError<any, any>, { accountId: string; photoId: string | null }>({
        mutationFn: async ({ accountId, photoId }) => {
            request.id = accountId;
            request.photoId = photoId;
            await createRequestValidationScheme.validate(request);

            return await receptionistsService.create(request);
        },
        retry: false,
        onSuccess: (data, variables) => {
            queryClient.setQueryData([ReceptionistsQueries.getById, variables.accountId], { ...request, photoId: variables.photoId });
            queryClient.invalidateQueries([ReceptionistsQueries.getPaged]);
            navigate(AppRoutes.Receptionists);
            enqueueSnackbar('Receptionist created successfully!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                setError('firstName', {
                    message: error.response.data.errors?.FirstName?.[0] || error.response.data.Message || '',
                });
                setError('lastName', {
                    message: error.response.data.errors?.LastName?.[0] || error.response.data.Message || '',
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
            } else {
                navigate(AppRoutes.Receptionists);
                enqueueSnackbar('Something went wrong.', {
                    variant: 'error',
                });
            }
        },
    });
};
