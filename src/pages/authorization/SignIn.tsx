import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { EmailAddressInput } from '../../components/EmailAddressInput/EmailAddressInput';
import { PasswordInput } from '../../components/PasswordInput/PasswordInput';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { useGetInitialProfile, useSignInQuery } from '../../hooks/requests/authorization';
import { useLoginValidator } from '../../hooks/validators/authorization/signIn';
import '../../styles/ModalForm.css';
import { ITokenResponse } from '../../types/response/authorization';

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
    useGetInitialProfile(tokenResponse as ITokenResponse);

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
