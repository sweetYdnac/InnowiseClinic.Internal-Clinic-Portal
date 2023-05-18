import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import jwt from 'jwt-decode';
import { useSnackbar } from 'notistack';
import randomize from 'randomatic';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthorizationService } from '../../api/services/AuthorizationService';
import { AppRoutes } from '../../constants/AppRoutes';
import { AuthorizationQueries } from '../../constants/QueryKeys';
import { PasswordBoundaries } from '../../constants/Validation';
import { IProfileState, setProfile } from '../../store/profileSlice';
import { setRole } from '../../store/roleSlice';
import { IJwtToken } from '../../types/common/IJwtToken';
import { ICreatedResponse } from '../../types/common/Responses';
import { IRegisterRequest } from '../../types/request/authorization';
import { ITokenResponse } from '../../types/response/authorization';
import { getProfile, getRoleByName } from '../../utils/functions';
import { useAppDispatch } from '../store';
import { ISignInForm } from '../validators/authorization/signIn';

export const useSignInQuery = (form: ISignInForm, setError: UseFormSetError<ISignInForm>, enabled = false) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<ITokenResponse, AxiosError<any, any>, ITokenResponse, QueryKey>({
        queryKey: [AuthorizationQueries.signIn, { ...form }],
        queryFn: async () => await AuthorizationService.signIn({ ...form }),
        enabled: enabled,
        retry: false,
        onSuccess(data) {
            const decoded = jwt<IJwtToken>(data.accessToken as string);
            dispatch(setRole(getRoleByName(decoded.role)));
            navigate(AppRoutes.Home);
        },
        onError(error) {
            if (error.response?.status === 400) {
                setError('email', {
                    message: error?.response?.data.errors?.Email?.[0] || error?.response?.data.Message || '',
                });

                setError('password', {
                    message: error?.response?.data.errors?.Password?.[0] || error?.response?.data.Message || '',
                });
            } else {
                enqueueSnackbar(`You are not allowed to perform this action. ${error.message}`, {
                    variant: 'warning',
                });
            }
        },
    });
};

export const useSignUpCommand = (email: string) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<ICreatedResponse | void, AxiosError<any, any>, void>({
        mutationFn: async () => {
            const request: IRegisterRequest = {
                email: email,
                password: randomize(
                    'Aa0',
                    Math.floor(Math.random() * (PasswordBoundaries.max - PasswordBoundaries.min + 1) + PasswordBoundaries.min)
                ),
            };

            return await AuthorizationService.signUp(request);
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                enqueueSnackbar('Something went wrong', {
                    variant: 'error',
                });
            }
        },
    });
};

export const useGetInitialProfile = (tokenResponse: ITokenResponse) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<any, AxiosError<any, any>, IProfileState, QueryKey>({
        queryKey: [AuthorizationQueries.getInitialProfile],
        queryFn: async () => {
            const decoded = jwt<IJwtToken>(tokenResponse.accessToken);
            const profile = await getProfile(decoded.role, decoded.sub);

            if (profile) {
                return dispatch(setProfile(profile as IProfileState));
            }
        },
        enabled: !!tokenResponse,
        retry: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        onError(error) {
            enqueueSnackbar(`Something went wrong. ${error.message}`, {
                variant: 'error',
            });
        },
        onSuccess() {
            enqueueSnackbar('You signed in successfully!', {
                variant: 'success',
            });
        },
    });
};
