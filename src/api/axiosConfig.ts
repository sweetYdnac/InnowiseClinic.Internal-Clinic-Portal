import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import { useNavigate } from 'react-router-dom';
import { PopupData } from '../components/Popup/Popup';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
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
        const navigate = useNavigate();

        switch (error.response?.status) {
            case 400: {
                // Bad request is handling in specific validator for request;
                throw error;
            }
            case 401: {
                return await AuthorizationService.refresh((error as AxiosError).config, navigate);
            }
            case 403: {
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: 'You are not allowed to perform this action',
                } as PopupData);
                break;
            }
            case 404:
            case 409:
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: error.response.data.Message,
                } as PopupData);
                break;
            case 500:
            default: {
                console.log(error);
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: 'Unknown error occurred',
                } as PopupData);
            }
        }
    }
);

export default axiosInstance;
