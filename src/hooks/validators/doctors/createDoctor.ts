import dayjs from 'dayjs';
import { useMemo } from 'react';
import * as yup from 'yup';
import { AccountStatuses } from '../../../constants/AccountStatuses';

export interface ICreateDoctorForm {
    photoUrl: string;
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
    const initialValues = useMemo(() => {
        return {
            photoUrl: '',
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
        } as ICreateDoctorForm;
    }, []);

    const validationScheme = useMemo(() => {
        return yup.object().shape({
            firstName: yup.string().required('Please, enter the first name'),
            lastName: yup.string().required('Please, enter the last name'),
            middleName: yup.string().notRequired(),
            dateOfBirth: yup.mixed<dayjs.Dayjs>().required('Please, select the date'),
            email: yup.string().required('Please, enter the email').email(`You've entered an invalid email`),
            specializationId: yup.string().required('Please, choose the specialisation'),
            specializationInput: yup.string().required('Invalid specialization name'),
            officeId: yup.string().required('Please, choose the office'),
            officeInput: yup.string().required('Invalid office address'),
            careerStartYear: yup
                .mixed<dayjs.Dayjs>()
                .required('Please, select the year')
                .test('is-greater-than-date-of-birth', 'Career start year should be greater than date of birth', (value, data) => {
                    const { dateOfBirth } = data.parent;
                    if (!dateOfBirth || !value) {
                        return true;
                    }

                    return value.year() > dateOfBirth.year();
                }),
            status: yup.mixed<AccountStatuses>().oneOf(Object.values(AccountStatuses) as AccountStatuses[], 'Please select the status'),
        });
    }, []);

    return { validationScheme, initialValues };
};
