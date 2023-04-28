import { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from 'jwt-decode';
import { EventType } from '../../store/eventTypes';
import { eventEmitter } from '../../store/events';
import IJwtToken from '../../types/common/IJwtToken';
import { Modals } from '../../types/enums/Modals';
import { Roles } from '../../types/enums/Roles';
import { ILoginRequest, IRegisterRequest } from '../../types/request/AuthorizationAPI_requests';
import { ITokenResponse } from '../../types/response/AuthorizationAPI_responses';
import { ICreatedResponse } from '../../types/response/common';
import axiosInstance from '../axiosConfig';

const getAccessToken = () => localStorage.getItem('accessToken');

const getAccountId = () => jwt<IJwtToken>(getAccessToken() as string).sub;

const isAuthorized = () => {
    const accessToken = getAccessToken();

    return !!accessToken && jwt<IJwtToken>(accessToken).exp * 1000 > Date.now();
};

const signIn = async (data: ILoginRequest) => {
    return await axiosInstance.post<ITokenResponse>('/authorization/signIn', data).then((response: AxiosResponse<ITokenResponse, any>) => {
        const decoded = jwt<IJwtToken>(response.data.accessToken);

        if (Object.values(Roles).every((item) => item.localeCompare(decoded.role, undefined, { sensitivity: 'accent' }))) {
            return Promise.reject(new Error('Invalid role.'));
        }

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
    dispatchEvent(new Event('storage'));
};

const refresh = async (config?: AxiosRequestConfig<any>) => {
    const refreshToken = localStorage.getItem('refreshToken');

    return await axiosInstance
        .post<ITokenResponse>('/authorization/refresh', { refreshToken })
        .then(async (response: AxiosResponse<ITokenResponse, any>) => {
            // setAuthData(response.data.accessToken ?? '', response.data.refreshToken ?? '');

            if (!response.data.accessToken || !response.data.refreshToken) {
                logout();
                eventEmitter.emit(`${EventType.CLICK_CLOSE_MODAL} ${Modals.Login}`);
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
    getAccountId,
    getAccessToken,
};

export default AuthorizationService;
