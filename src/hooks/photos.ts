import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import PhotosService from '../api/services/PhotosService';
import { AppRoutes } from '../constants/AppRoutes';
import { ICreatedResponse } from '../types/common/Responses';
import { showPopup } from '../utils/functions';

export const useCreatePhotoCommand = (photoUrl: string) => {
    const navigate = useNavigate();

    return useMutation<ICreatedResponse, AxiosError<any, any>, void>({
        mutationFn: async () => await PhotosService.create(photoUrl),
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                showPopup('Something went wrong.');
            }
        },
    });
};
