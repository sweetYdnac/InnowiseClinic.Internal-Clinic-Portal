import { yupResolver } from '@hookform/resolvers/yup';
import { AccountCircle } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import jwt from 'jwt-decode';
import { FunctionComponent, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { Textfield } from '../../components/Textfield/Textfield';
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
        getValues,
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { data: tokenResponse, refetch } = useSignInQuery(getValues(), setError);

    const token = useMemo(() => {
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

    useInitialProfileQuery(token.accountId, token.role, !!tokenResponse?.accessToken);

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

            <Textfield
                id={register('email').name}
                control={control}
                inputMode='email'
                displayName='Email Address'
                placeholder='example@gmail.com'
                workMode='edit'
                startAdornment={<AccountCircle />}
            />
            <PasswordInput id={register('password').name} control={control} displayName='Password' />

            <SubmitButton errors={errors} shouldBeTouched={[touchedFields.email, touchedFields.password]}>
                Enter
            </SubmitButton>
        </Box>
    );
};
