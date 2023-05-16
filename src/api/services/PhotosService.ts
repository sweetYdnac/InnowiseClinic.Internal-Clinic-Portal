import { ICreatedResponse, INoContentResponse } from '../../types/common/Responses';
import { axiosInstance } from '../axiosConfig';

const getById = async (id: string) => {
    const response = await axiosInstance.get<Blob>(`/documents/photos/${id}`, {
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
};

const update = async (id: string, photo: string) => {
    const blob = await (await fetch(photo)).blob();
    const file = new File([blob], id, { type: blob.type });

    const formData = new FormData();
    formData.append('photo', file);

    return (
        await axiosInstance.put<INoContentResponse>(`/documents/photos/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    ).data;
};

const create = async (photo: string) => {
    const blob = await (await fetch(photo)).blob();
    const file = new File([blob], 'photo', { type: blob.type });

    const formData = new FormData();
    formData.append('photo', file);

    return (
        await axiosInstance.post<ICreatedResponse>(`/documents/photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    ).data;
};

export const PhotosService = {
    getById,
    update,
    create,
};
