import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import jwt from 'jwt-decode';
import { FunctionComponent, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { EmailAddressInput } from '../../components/EmailAddressInput/EmailAddressInput';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { useInitialProfileQuery, useSignInQuery } from '../../hooks/requests/authorization';
import { useLoginValidator } from '../../hooks/validators/authorization/signIn';
import '../../styles/ModalForm.css';
import { IJwtToken } from '../../types/common/IJwtToken';

export const SignIn: FunctionComponent = () => {
    const { validationScheme, initialValues } = useLoginValidator();

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, touchedFields },
        watch,
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { data: tokenResponse, refetch } = useSignInQuery(watch(), setError);

    const t = useMemo(() => {
        if (tokenResponse) {
            const decoded = jwt<IJwtToken>(tokenResponse?.accessToken as string);

            return {
                accountId: decoded.sub,
                role: decoded.role,
            };
        } else {
            return {
                accountId: '',
                role: '',
            };
        }
    }, [tokenResponse]);

    useInitialProfileQuery(t.accountId, t.role, !!tokenResponse?.accessToken);

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
                Sign In
            </Typography>

            <EmailAddressInput id={register('email').name} control={control} displayName='Email Address' />
            <PasswordInput id={register('password').name} control={control} displayName='Password' />

            <SubmitButton errors={errors} shouldBeTouched={[touchedFields.email, touchedFields.password]}>
                Enter
            </SubmitButton>
        </Box>
    );
};
