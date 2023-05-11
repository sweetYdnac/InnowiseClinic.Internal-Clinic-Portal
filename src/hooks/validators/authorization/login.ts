import * as yup from 'yup';

export const LOGIN_VALIDATOR = yup.object().shape({
    email: yup.string().required('Please, enter the email').email(`You've entered an invalid email`),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(15, 'Password must be less than 15 characters')
        .required('Please, enter the password'),
});
