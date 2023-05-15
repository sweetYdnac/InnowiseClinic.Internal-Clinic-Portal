import { useMemo } from 'react';
import * as yup from 'yup';
import { PasswordBoundaries } from '../../../constants/Validation';

export const useSignUpValidator = () => {
    const validationScheme = useMemo(() => {
        return yup.object().shape({
            email: yup.string().required('Please, enter the email').email(`You've entered an invalid email`),
            password: yup
                .string()
                .min(PasswordBoundaries.min, 'Password must be at least 6 characters')
                .max(PasswordBoundaries.max, 'Password must be less than 15 characters')
                .required('Please, enter the password'),
        });
    }, []);

    return { validationScheme };
};
