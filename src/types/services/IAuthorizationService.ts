import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ICreatedResponse } from '../common/Responses';
import { ILoginRequest, IRegisterRequest } from '../request/authorization';
import { ITokenResponse } from '../response/authorization';

export interface IAuthorizationService {
    signIn: (data: ILoginRequest) => Promise<ITokenResponse>;
    signUp: (data: IRegisterRequest) => Promise<ICreatedResponse>;
    refresh: (config?: AxiosRequestConfig<any>) => Promise<AxiosResponse<any, any> | undefined>;
    logout: () => void;
    isAuthorized: () => boolean;
    getAccessToken: () => string | null;
    getRoleName: () => string;
    getAccountId: () => string;
}
