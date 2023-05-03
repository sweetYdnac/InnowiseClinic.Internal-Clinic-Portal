import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import jwt from 'jwt-decode';
import { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import AuthorizationService from '../../api/services/AuthorizationService';
import EmailAddressInput from '../../components/EmailAddressInput/EmailAddressInput';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import { PopupData } from '../../components/Popup/Popup';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import { useAppDispatch } from '../../hooks/store';
import { IProfileState, setProfile } from '../../store/profileSlice';
import { setRole } from '../../store/roleSlice';
import '../../styles/ModalForm.css';
import IJwtToken from '../../types/common/IJwtToken';
import { ILoginRequest } from '../../types/request/AuthorizationAPI_requests';
import { ITokenResponse } from '../../types/response/AuthorizationAPI_responses';
import { IDoctorResponse, IReceptionistsResponse } from '../../types/response/ProfilesAPI_responses';
import { getProfile, getRoleByName } from '../../utils/functions';

const validationSchema = yup.object().shape({
    email: yup.string().required('Please, enter the email').email(`You've entered an invalid email`),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(15, 'Password must be less than 15 characters')
        .required('Please, enter the password'),
});

const Login: FunctionComponent = () => {
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, touchedFields, defaultValues },
        getValues,
    } = useForm<ILoginRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { data: tokenResponse, refetch } = useQuery<any, Error, ITokenResponse>({
        queryKey: ['signIn'],
        queryFn: async () => await AuthorizationService.signIn(getValues()),
        enabled: false,
        retry: false,
        onSuccess(data) {
            const decoded = jwt<IJwtToken>(data.accessToken as string);
            dispatch(setRole(getRoleByName(decoded.role)));
        },
        onError(error) {
            if (error instanceof AxiosError) {
                setError('email', {
                    message: error?.response?.data.errors?.Email?.[0] || error?.response?.data.Message || '',
                });

                setError('password', {
                    message: error?.response?.data.errors?.Password?.[0] || error?.response?.data.Message || '',
                });
            } else {
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: `You are not allowed to perform this action. ${error.message}`,
                } as PopupData);
            }
        },
    });

    useQuery<any, Error, IDoctorResponse | IReceptionistsResponse>({
        queryKey: ['profile'],
        queryFn: async () => {
            const decoded = jwt<IJwtToken>(tokenResponse?.accessToken as string);
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
            eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                message: `Something goes wrong. ${error.message}`,
            } as PopupData);
        },
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                onSubmit={handleSubmit(() => refetch())}
                component='form'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
                noValidate
                autoComplete='off'
            >
                <Typography variant='h4' gutterBottom>
                    Login
                </Typography>

                <EmailAddressInput id={register('email').name} control={control} displayName='Email Address' />
                <PasswordInput id={register('password').name} control={control} displayName='Password' />

                <SubmitButton errors={errors} touchedFields={touchedFields} defaultValues={defaultValues}>
                    Enter
                </SubmitButton>
            </Box>
        </div>
    );
};

export default Login;
