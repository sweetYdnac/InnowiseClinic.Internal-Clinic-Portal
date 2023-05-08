import { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from 'jwt-decode';
import { NavigateFunction } from 'react-router-dom';
import { AppRoutes } from '../../constants/AppRoutes';
import { Roles } from '../../constants/Roles';
import IJwtToken from '../../types/common/IJwtToken';
import { ICreatedResponse } from '../../types/common/Responses';
import { ILoginRequest, IRegisterRequest } from '../../types/request/authorization';
import { ITokenResponse } from '../../types/response/authorization';
import axiosInstance from '../axiosConfig';

function setAuthData(accessToken: string, refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);

    const decoded = jwt<IJwtToken>(accessToken);
    localStorage.setItem('expiration', decoded.exp.toString());

    dispatchEvent(new Event('storage'));
}

const getAccessToken = () => localStorage.getItem('accessToken');

const isAuthorized = () => {
    const accessToken = getAccessToken();

    return !!accessToken && Number(localStorage.getItem('expiration')) * 1000 > Date.now();
};

const getRoleName = () => {
    const accessToken = getAccessToken();

    return !!accessToken ? jwt<IJwtToken>(getAccessToken() as string).role : '';
};

const getAccountId = () => {
    const accessToken = getAccessToken();

    return !!accessToken ? jwt<IJwtToken>(getAccessToken() as string).sub : '';
};

const signIn = async (data: ILoginRequest) => {
    return await axiosInstance.post<ITokenResponse>('/authorization/signIn', data).then((response: AxiosResponse<ITokenResponse, any>) => {
        const decoded = jwt<IJwtToken>(response.data.accessToken);

        if (Object.values(Roles).every((item) => item.localeCompare(decoded.role, undefined, { sensitivity: 'accent' }))) {
            return Promise.reject(new Error('Invalid role.'));
        }

        setAuthData(response.data.accessToken, response.data.refreshToken);
        return response.data;
    });
};

const signUp = async (data: IRegisterRequest) => {
    return await axiosInstance
        .post<ICreatedResponse>('/authorization/signUp', data)
        .then(async () => await AuthorizationService.signIn(data as ILoginRequest));
};

const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiration');
    dispatchEvent(new Event('storage'));
};

const refresh = async (config?: AxiosRequestConfig<any>, navigate?: NavigateFunction) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        navigate?.(AppRoutes.Login);
        return;
    }

    return await axiosInstance
        .post<ITokenResponse>('/authorization/refresh', { refreshToken })
        .then(async (response: AxiosResponse<ITokenResponse, any>) => {
            setAuthData(response.data.accessToken ?? '', response.data.refreshToken ?? '');

            if (!response.data.accessToken || !response.data.refreshToken) {
                logout();
                navigate?.(AppRoutes.Login);
            } else {
                if (config) {
                    return await axiosInstance(config);
                }
            }
        });
};

const AuthorizationService = {
    signIn,
    signUp,
    logout,
    refresh,
    isAuthorized,
    getAccessToken,
    getRoleName,
    getAccountId,
};

export default AuthorizationService;
