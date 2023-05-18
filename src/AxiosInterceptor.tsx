import { AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import { useSnackbar } from 'notistack';
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from './hooks/services/axiosConfig';
import { useAuthorizationService } from './hooks/services/useAuthorizationService';
import { AppRoutes } from './routes/AppRoutes';

interface AxiosInterceptorProps {
    children: ReactNode;
}

export const AxiosInterceptor = ({ children }: AxiosInterceptorProps) => {
    const authorizationService = useAuthorizationService();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const request = (config: InternalAxiosRequestConfig<any>) => {
            if (authorizationService.isAuthorized()) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${authorizationService.getAccessToken()}`,
                } as AxiosRequestHeaders;
            }

            return config;
        };

        const error = async (error: any) => {
            switch (error.response?.status) {
                case 400: {
                    // Bad request is handling in specific validator for request;
                    throw error;
                }
                case 401: {
                    return await authorizationService.refresh((error as AxiosError).config);
                }
                case 403: {
                    navigate(AppRoutes.Home);
                    enqueueSnackbar('You are not allowed to perform this action', {
                        variant: 'info',
                    });
                    break;
                }
                case 404:
                case 409:
                    enqueueSnackbar(error.response.data.Message, {
                        variant: 'info',
                    });
                    break;
                case 500:
                default: {
                    console.log(error);
                    navigate(AppRoutes.Home);
                    enqueueSnackbar('Unknown error occurred', {
                        variant: 'error',
                    });
                }
            }
        };

        const requestInterceptor = axiosInstance.interceptors.request.use(request);
        const responseInterceptor = axiosInstance.interceptors.response.use((response) => response, error);

        return () => {
            axiosInstance.interceptors.response.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return <>{children}</>;
};
