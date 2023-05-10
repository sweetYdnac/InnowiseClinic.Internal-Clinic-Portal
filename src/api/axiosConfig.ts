import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import { showPopup } from '../utils/functions';
import AuthorizationService from './services/AuthorizationService';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:10001',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    if (AuthorizationService.isAuthorized()) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${AuthorizationService.getAccessToken()}`,
        } as AxiosRequestHeaders;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        switch (error.response?.status) {
            case 400: {
                // Bad request is handling in specific validator for request;
                throw error;
            }
            case 401: {
                return await AuthorizationService.refresh((error as AxiosError).config);
            }
            case 403: {
                showPopup('You are not allowed to perform this action');
                break;
            }
            case 404:
            case 409:
                showPopup(error.response.data.Message);
                break;
            case 500:
            default: {
                console.log(error);
                showPopup('Unknown error occurred');
            }
        }
    }
);

export default axiosInstance;
