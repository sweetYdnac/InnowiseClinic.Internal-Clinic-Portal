import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { ICreatedResponse, INoContentResponse } from '../../types/common/Responses';
import { IPhotosService } from '../../types/services/IPhotosService';
import { axiosInstance } from './axiosConfig';

export const usePhotosService = () =>
    ({
        getById: async (id: string) => {
            const response = await axiosInstance.get<Blob>(`${ApiBaseUrls.Photos}/${id}`, {
                responseType: 'blob',
            });

            const reader = new FileReader();

            return new Promise<string>((resolve, reject) => {
                reader.onload = () => {
                    const imageDataUrl = reader.result as string;
                    resolve(imageDataUrl);
                };

                reader.onerror = (error) => {
                    reject(error);
                };

                reader.readAsDataURL(response.data);
            });
        },

        create: async (photo: string) => {
            const blob = await (await fetch(photo)).blob();
            const file = new File([blob], 'photo', { type: blob.type });

            const formData = new FormData();
            formData.append('photo', file);

            return (
                await axiosInstance.post<ICreatedResponse>(ApiBaseUrls.Photos, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
            ).data;
        },

        update: async (id: string, photo: string) => {
            const blob = await (await fetch(photo)).blob();
            const file = new File([blob], id, { type: blob.type });

            const formData = new FormData();
            formData.append('photo', file);

            return (
                await axiosInstance.put<INoContentResponse>(`${ApiBaseUrls.Photos}/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
            ).data;
        },
    } as IPhotosService);
