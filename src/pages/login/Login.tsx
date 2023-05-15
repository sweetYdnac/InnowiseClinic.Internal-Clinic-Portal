import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import jwt from 'jwt-decode';
import { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthorizationService } from '../../api/services/AuthorizationService';
import { EmailAddressInput } from '../../components/EmailAddressInput/EmailAddressInput';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { AppRoutes } from '../../constants/AppRoutes';
import { useAppDispatch } from '../../hooks/store';
import { useLoginValidator } from '../../hooks/validators/authorization/login';
import { IProfileState, setProfile } from '../../store/profileSlice';
import { setRole } from '../../store/roleSlice';
import '../../styles/ModalForm.css';
import { IJwtToken } from '../../types/common/IJwtToken';
import { ITokenResponse } from '../../types/response/authorization';
import { IDoctorResponse } from '../../types/response/doctors';
import { IReceptionistsResponse } from '../../types/response/receptionists';
import { getProfile, getRoleByName, showPopup } from '../../utils/functions';

export const Login: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { validationScheme, initialValues } = useLoginValidator();

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, touchedFields },
        getValues,
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { data: tokenResponse, refetch } = useQuery<any, Error, ITokenResponse>({
        queryKey: ['signIn'],
        queryFn: async () => await AuthorizationService.signIn({ ...getValues() }),
        enabled: false,
        retry: false,
        onSuccess(data) {
            const decoded = jwt<IJwtToken>(data.accessToken as string);
            dispatch(setRole(getRoleByName(decoded.role)));
            navigate(AppRoutes.Home);
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
                showPopup(`You are not allowed to perform this action. ${error.message}`);
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
            showPopup(`Something goes wrong. ${error.message}`);
        },
        onSuccess() {
            showPopup('You signed in successfully!');
        },
    });

    return (
        <Box
            onSubmit={handleSubmit(() => refetch())}
            component='form'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            noValidate
            autoComplete='off'
        >
            <Typography variant='h4' sx={{ marginBottom: '50px' }} gutterBottom>
                Login
            </Typography>

            <EmailAddressInput id={register('email').name} control={control} displayName='Email Address' />
            <PasswordInput id={register('password').name} control={control} displayName='Password' />

            <SubmitButton errors={errors} shouldBeTouched={[touchedFields.email, touchedFields.password]}>
                Enter
            </SubmitButton>
        </Box>
    );
};
