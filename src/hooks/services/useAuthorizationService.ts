import { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from 'jwt-decode';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { ApiBaseUrls } from '../../constants/ApiBaseUrls';
import { LocalStorage } from '../../constants/LocalStorage';
import { Roles } from '../../constants/Roles';
import { AppRoutes } from '../../routes/AppRoutes';
import { IJwtToken } from '../../types/common/IJwtToken';
import { ICreatedResponse } from '../../types/common/Responses';
import { ILoginRequest, IRegisterRequest } from '../../types/request/authorization';
import { ITokenResponse } from '../../types/response/authorization';
import { IAuthorizationService } from '../../types/services/IAuthorizationService';
import { axiosInstance } from './axiosConfig';

const setAuthData = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(LocalStorage.RefreshToken, refreshToken);
    localStorage.setItem(LocalStorage.AccessToken, accessToken);

    const decoded = jwt<IJwtToken>(accessToken);
    localStorage.setItem(LocalStorage.ExpirationTime, decoded.exp.toString());

    dispatchEvent(new Event('storage'));
};

const logout = () => {
    localStorage.removeItem(LocalStorage.AccessToken);
    localStorage.removeItem(LocalStorage.RefreshToken);
    localStorage.removeItem(LocalStorage.ExpirationTime);
    dispatchEvent(new Event('storage'));
};

const getAccessToken = () => localStorage.getItem(LocalStorage.AccessToken);

export const useAuthorizationService = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return {
        signIn: async (data: ILoginRequest) => {
            return await axiosInstance
                .post<ITokenResponse>(`${ApiBaseUrls.Authorization}/signIn`, data)
                .then((response: AxiosResponse<ITokenResponse, any>) => {
                    const decoded = jwt<IJwtToken>(response.data.accessToken);

                    if (Object.values(Roles).every((item) => item.localeCompare(decoded.role, undefined, { sensitivity: 'accent' }))) {
                        return Promise.reject(new Error('Invalid role.'));
                    }

                    setAuthData(response.data.accessToken, response.data.refreshToken);
                    return response.data;
                });
        },

        signUp: async (data: IRegisterRequest) =>
            (await axiosInstance.post<ICreatedResponse>(`${ApiBaseUrls.Authorization}/signUp`, data)).data,

        refresh: async (config?: AxiosRequestConfig<any>) => {
            const refreshToken = localStorage.getItem(LocalStorage.RefreshToken);
            if (!refreshToken) {
                logout();
                navigate(AppRoutes.SignIn);
                return;
            }

            return await axiosInstance
                .post<ITokenResponse>(`${ApiBaseUrls.Authorization}/refresh`, { refreshToken })
                .then(async (response: AxiosResponse<ITokenResponse, any>) => {
                    setAuthData(response.data.accessToken ?? '', response.data.refreshToken ?? '');

                    if (!response.data.accessToken || !response.data.refreshToken) {
                        logout();
                        navigate(AppRoutes.SignIn);
                        enqueueSnackbar('Your session has expired', {
                            variant: 'warning',
                        });
                    } else {
                        if (config) {
                            return await axiosInstance(config);
                        }
                    }
                });
        },

        logout: () => {
            logout();
            navigate(AppRoutes.Home);
        },

        isAuthorized: () => {
            const accessToken = getAccessToken();

            return !!accessToken && Number(localStorage.getItem(LocalStorage.ExpirationTime)) * 1000 > Date.now();
        },

        getAccessToken: getAccessToken,

        getRoleName: () => {
            const accessToken = getAccessToken();

            return !!accessToken ? jwt<IJwtToken>(getAccessToken() as string).role : '';
        },

        getAccountId: () => {
            const accessToken = getAccessToken();

            return !!accessToken ? jwt<IJwtToken>(getAccessToken() as string).sub : '';
        },
    } as IAuthorizationService;
};
