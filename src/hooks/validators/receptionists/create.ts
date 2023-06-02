import { AccountStatuses } from '../../../constants/AccountStatuses';
import { PasswordBoundaries } from '../../../constants/Validation';
import { Yup } from '../YupConfiguration';

export interface ICreateReceptionistForm {
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    officeId: string;
    officeAddress: string;
    status: number;
}

export const useCreateReceptionistValidator = () => {
    const initialValues: ICreateReceptionistForm = {
        photoId: null,
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        officeId: '',
        officeAddress: '',
        status: AccountStatuses.Inactive,
    };

    const formValidationScheme = Yup.object().shape({
        photoId: Yup.string().notRequired(),
        firstName: Yup.string().required('Please, enter the first name'),
        lastName: Yup.string().required('Please, enter the last name'),
        middleName: Yup.string().notRequired(),
        email: Yup.string().required('Please, enter the email').email(`You've entered an invalid email`),
        officeId: Yup.string().required('Please, choose the office'),
        officeAddress: Yup.string().required('Invalid office address'),
        status: Yup.mixed<AccountStatuses>().oneOf(Object.values(AccountStatuses) as AccountStatuses[], 'Please select the status'),
    });

    const requestValidationScheme = Yup.object().shape({
        id: Yup.string().required(),
        password: Yup.string()
            .min(PasswordBoundaries.min, `Password must be at least ${PasswordBoundaries.min} characters`)
            .max(PasswordBoundaries.max, `Password must be less than ${PasswordBoundaries.max} characters`)
            .required('Please, enter the password'),
    });

    return { formValidationScheme, requestValidationScheme, initialValues };
};
