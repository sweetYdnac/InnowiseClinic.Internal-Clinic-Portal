import { PasswordBoundaries } from '../../../constants/Validation';
import { Yup } from '../YupConfiguration';

export const useSignUpValidator = () => {
    const validationScheme = Yup.object().shape({
        email: Yup.string().required('Please, enter the email').email(`You've entered an invalid email`),
        password: Yup.string()
            .min(PasswordBoundaries.min, 'Password must be at least 6 characters')
            .max(PasswordBoundaries.max, 'Password must be less than 15 characters')
            .required('Please, enter the password'),
    });

    return { validationScheme };
};
