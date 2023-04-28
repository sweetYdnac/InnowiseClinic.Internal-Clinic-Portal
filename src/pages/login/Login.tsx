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
import DoctorsService from '../../api/services/DoctorsService';
import ReceptionistsService from '../../api/services/ReceptionistsService';
import EmailAddressInput from '../../components/EmailAddressInput/EmailAddressInput';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import { PopupData } from '../../components/Popup/Popup';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import { useAppDispatch } from '../../hooks/store';
import { IAuthorizationState, setAuthorization } from '../../store/authorizationSlice';
import { EventType } from '../../store/eventTypes';
import { eventEmitter } from '../../store/events';
import { IProfileState, setProfile } from '../../store/profileSlice';
import '../../styles/ModalForm.css';
import IJwtToken from '../../types/common/IJwtToken';
import { Roles } from '../../types/enums/Roles';
import { ILoginRequest } from '../../types/request/AuthorizationAPI_requests';
import { ITokenResponse } from '../../types/response/AuthorizationAPI_responses';
import { IDoctorResponse, IReceptionistsResponse } from '../../types/response/ProfilesAPI_responses';

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
            dispatch(
                setAuthorization({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    role: decoded.role,
                    expirationTime: decoded.exp,
                } as IAuthorizationState)
            );
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

    const getProfile = useQuery<any, Error, IDoctorResponse | IReceptionistsResponse>({
        queryKey: ['profile'],
        queryFn: async () => {
            const decoded = jwt<IJwtToken>(tokenResponse?.accessToken as string);

            switch (decoded.role.toLowerCase()) {
                case Roles.Doctor.toLowerCase():
                    const doctor = await DoctorsService.getById(decoded.sub);
                    return dispatch(
                        setProfile({
                            id: decoded.sub,
                            photoId: doctor.photoId,
                            firstName: doctor.firstName,
                            lastName: doctor.lastName,
                            middleName: doctor.middleName,
                            officeAddress: doctor.officeAddress,
                            dateOfBirth: doctor.dateOfBirth,
                            specializationName: doctor.specializationName,
                            status: doctor.status,
                        } as IProfileState)
                    );
                case Roles.Receptionist.toLowerCase():
                    const receptionist = await ReceptionistsService.getById(decoded.sub);
                    return dispatch(
                        setProfile({
                            id: decoded.sub,
                            photoId: receptionist.photoId,
                            firstName: receptionist.firstName,
                            lastName: receptionist.lastName,
                            middleName: receptionist.middleName,
                            officeAddress: receptionist.officeAddress,
                        } as IProfileState)
                    );
                default:
                    console.log('invalid role');
                    break;
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
