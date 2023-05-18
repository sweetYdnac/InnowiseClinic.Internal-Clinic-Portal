import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import jwt from 'jwt-decode';
import { useSnackbar } from 'notistack';
import randomize from 'randomatic';
import { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../constants/AppRoutes';
import { AuthorizationQueries } from '../../constants/QueryKeys';
import { Roles } from '../../constants/Roles';
import { PasswordBoundaries } from '../../constants/Validation';
import { IProfileState, setProfile } from '../../store/profileSlice';
import { setRole } from '../../store/roleSlice';
import { IJwtToken } from '../../types/common/IJwtToken';
import { ICreatedResponse } from '../../types/common/Responses';
import { IRegisterRequest } from '../../types/request/authorization';
import { ITokenResponse } from '../../types/response/authorization';
import { getRoleByName } from '../../utils/functions';
import { useAuthorizationService } from '../services/useAuthorizationService';
import { useDoctorsService } from '../services/useDoctorsService';
import { useReceptionistService } from '../services/useReceptionistsService';
import { useAppDispatch } from '../store';
import { ISignInForm } from '../validators/authorization/signIn';

export const useSignInQuery = (form: ISignInForm, setError: UseFormSetError<ISignInForm>, enabled = false) => {
    const authorizationService = useAuthorizationService();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<ITokenResponse, AxiosError<any, any>, ITokenResponse, QueryKey>({
        queryKey: [AuthorizationQueries.signIn, { ...form }],
        queryFn: async () => await authorizationService.signIn({ ...form }),
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

export const useInitialProfileQuery = (accountId?: string, roleName?: string, enabled = false) => {
    const authorizationService = useAuthorizationService();
    const doctorsService = useDoctorsService();
    const receptionistsService = useReceptionistService();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    return useQuery<any, AxiosError<any, any>, IProfileState, QueryKey>({
        queryKey: [AuthorizationQueries.getInitialProfile],
        queryFn: async () => {
            let profile: IProfileState | null = null;
            switch (getRoleByName(roleName ?? authorizationService.getRoleName())) {
                case Roles.Doctor:
                    const doctor = await doctorsService.getById(accountId ?? authorizationService.getAccountId());
                    profile = {
                        id: accountId,
                        photoId: doctor.photoId,
                        firstName: doctor.firstName,
                        lastName: doctor.lastName,
                        middleName: doctor.middleName,
                        officeAddress: doctor.officeAddress,
                        dateOfBirth: doctor.dateOfBirth,
                        specializationName: doctor.specializationName,
                        status: doctor.status,
                    } as IProfileState;
                    break;
                case Roles.Receptionist:
                    const receptionist = await receptionistsService.getById(accountId ?? authorizationService.getAccountId());
                    profile = {
                        id: accountId,
                        photoId: receptionist.photoId,
                        firstName: receptionist.firstName,
                        lastName: receptionist.lastName,
                        middleName: receptionist.middleName,
                        officeAddress: receptionist.officeAddress,
                    } as IProfileState;
                    break;
                default:
                    console.log('invalid role');
                    break;
            }

            if (profile) {
                return dispatch(setProfile(profile as IProfileState));
            }
        },
        enabled: enabled,
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

export const useSignUpCommand = (email: string) => {
    const authorizationService = useAuthorizationService();
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

            return await authorizationService.signUp(request);
        },
        retry: false,
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
