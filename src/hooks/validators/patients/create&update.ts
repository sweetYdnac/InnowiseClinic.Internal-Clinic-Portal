import dayjs from 'dayjs';
import { useMemo } from 'react';
import { dateApiFormat } from '../../../constants/Formats';
import { IPatientResponse } from '../../../types/response/patients';
import { Yup } from '../YupConfiguration';

export interface IPatientForm {
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: dayjs.Dayjs | null;
    phoneNumber: string;
}

export const usePatientValidator = (patient?: IPatientResponse) => {
    const initialValues = useMemo(
        () =>
            ({
                photoId: patient?.photoId,
                firstName: patient?.firstName ?? '',
                lastName: patient?.lastName ?? '',
                middleName: patient?.middleName ?? '',
                dateOfBirth: dayjs(patient?.dateOfBirth, dateApiFormat),
                phoneNumber: patient?.phoneNumber ?? '',
            } as IPatientForm),
        [patient?.dateOfBirth, patient?.firstName, patient?.lastName, patient?.middleName, patient?.phoneNumber, patient?.photoId]
    );

    const formValidationScheme = Yup.object().shape({
        photoId: Yup.string().notRequired(),
        firstName: Yup.string().required('Please, enter the first name'),
        lastName: Yup.string().required('Please, enter the last name'),
        middleName: Yup.string().notRequired(),
        dateOfBirth: Yup.date()
            .max(dayjs(), 'Date could not be future')
            .required('Please, enter a date')
            .typeError('Please, enter a valid date'),
        phoneNumber: Yup.string().required('Please, enter a phone number').matches(/^\d+$/, `You've entered an invalid phone number`),
    });

    const createRequestValidationScheme = Yup.object().shape({
        id: Yup.string().required(),
    });

    return { formValidationScheme, createRequestValidationScheme, initialValues };
};
