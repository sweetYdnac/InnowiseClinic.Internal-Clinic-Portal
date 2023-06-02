import dayjs from 'dayjs';
import { AccountStatuses } from '../../../constants/AccountStatuses';
import { PasswordBoundaries } from '../../../constants/Validation';
import { Yup } from '../YupConfiguration';

export interface ICreateDoctorForm {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: dayjs.Dayjs | null;
    email: string;
    specializationId: string;
    specializationInput: string;
    officeId: string;
    officeInput: string;
    careerStartYear: dayjs.Dayjs | null;
    status: AccountStatuses;
}

export const useCreateDoctorValidator = () => {
    const initialValues: ICreateDoctorForm = {
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: null,
        email: '',
        specializationId: '',
        specializationInput: '',
        officeId: '',
        officeInput: '',
        careerStartYear: null,
        status: AccountStatuses.Inactive,
    };

    const formValidationScheme = Yup.object().shape({
        firstName: Yup.string().required('Please, enter the first name'),
        lastName: Yup.string().required('Please, enter the last name'),
        middleName: Yup.string().notRequired(),
        dateOfBirth: Yup.date()
            .max(dayjs(), 'Date could not be future')
            .required('Please, enter a date')
            .typeError('Please, enter a valid date'),
        email: Yup.string().required('Please, enter the email').email(`You've entered an invalid email`),
        specializationId: Yup.string().required('Please, choose the specialization'),
        specializationInput: Yup.string().required('Invalid specialization name'),
        officeId: Yup.string().required('Please, choose the office'),
        officeInput: Yup.string().required('Invalid office address'),
        careerStartYear: Yup.date()
            .required('Please, select the year')
            .typeError('Please, enter a valid date')
            .test('is-greater-than-date-of-birth', 'Career start year should be greater than date of birth', (value, data) => {
                const { dateOfBirth } = data.parent;
                if (!dateOfBirth || !value) {
                    return true;
                }

                return value.getFullYear() > dateOfBirth.getFullYear();
            }),
        status: Yup.mixed<AccountStatuses>()
            .oneOf(Object.values(AccountStatuses) as AccountStatuses[], 'Please select the status')
            .required('Please, select the status'),
    });

    const requestValidationScheme = Yup.object().shape({
        id: Yup.string().required(),
        password: Yup.string()
            .min(PasswordBoundaries.min, `Password must be at least ${PasswordBoundaries.min} characters`)
            .max(PasswordBoundaries.max, `Password must be less than ${PasswordBoundaries.max} characters`)
            .required('Please, enter the password'),
    });

    return { formValidationScheme, initialValues, requestValidationScheme };
};
