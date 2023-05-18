import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { PhotosService } from '../../api/services/PhotosService';
import { AppRoutes } from '../../constants/AppRoutes';
import { PhotosQueries } from '../../constants/QueryKeys';
import { ICreatedResponse, INoContentResponse } from '../../types/common/Responses';

export const useGetPhotoQuery = (id: string | null, enabled = false) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<string, AxiosError, string, QueryKey>({
        queryKey: [PhotosQueries.getById, id],
        queryFn: async () => (id === null ? '' : await PhotosService.getById(id)),
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

export const useCreatePhotoCommand = (photoUrl: string) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<ICreatedResponse, AxiosError<any, any>, void>({
        mutationFn: async () => await PhotosService.create(photoUrl),
        onSuccess: (response) => {
            queryClient.setQueryData([PhotosQueries.getById, response.id], photoUrl);
            enqueueSnackbar('Photo created successfully!', {
                variant: 'success',
            });
        },
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

export const useUpdatePhotoCommand = (id: string, photoUrl: string) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<INoContentResponse, AxiosError<any, any>, void>({
        mutationFn: async () => await PhotosService.update(id, photoUrl),
        onSuccess: () => {
            queryClient.setQueryData([PhotosQueries.getById, id], photoUrl);
            enqueueSnackbar('Photo updated successfully!', {
                variant: 'success',
            });
        },
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
