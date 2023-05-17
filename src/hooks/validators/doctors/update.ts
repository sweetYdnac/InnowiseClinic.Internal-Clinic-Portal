import dayjs from 'dayjs';
import { useMemo } from 'react';
import { AccountStatuses } from '../../../constants/AccountStatuses';
import { dateApiFormat } from '../../../constants/formats';
import { IDoctorResponse } from '../../../types/response/doctors';
import { Yup } from '../YupConfiguration';

export interface IUpdateDoctorForm {
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: dayjs.Dayjs | null;
    specializationId: string;
    specializationInput: string;
    officeId: string;
    officeInput: string;
    careerStartYear: dayjs.Dayjs | null;
    status: AccountStatuses;
}

export const useUpdateDoctorValidator = (doctor: IDoctorResponse | undefined) => {
    const initialValues = useMemo(
        () =>
            ({
                photoId: doctor?.photoId,
                firstName: doctor?.firstName ?? '',
                lastName: doctor?.lastName ?? '',
                middleName: doctor?.middleName ?? '',
                dateOfBirth: dayjs(doctor?.dateOfBirth, dateApiFormat),
                specializationId: doctor?.specializationId,
                specializationInput: doctor?.specializationName,
                officeId: doctor?.officeId,
                officeInput: doctor?.officeAddress,
                careerStartYear: dayjs(doctor?.careerStartYear.toString(), 'YYYY'),
                status: doctor?.status ?? AccountStatuses.None,
            } as IUpdateDoctorForm),
        [
            doctor?.careerStartYear,
            doctor?.dateOfBirth,
            doctor?.firstName,
            doctor?.lastName,
            doctor?.middleName,
            doctor?.officeAddress,
            doctor?.officeId,
            doctor?.photoId,
            doctor?.specializationId,
            doctor?.specializationName,
            doctor?.status,
        ]
    );

    const validationScheme = Yup.object().shape({
        photoId: Yup.string().notRequired(),
        firstName: Yup.string().required('Please, enter the first name'),
        lastName: Yup.string().required('Please, enter the last name'),
        middleName: Yup.string().notRequired(),
        dateOfBirth: Yup.date()
            .max(dayjs(), 'Date could not be future')
            .required('Please, enter a valid date')
            .typeError('Please, enter a valid date'),
        specializationId: Yup.string().required('Please, choose the specialisation'),
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
        status: Yup.mixed<AccountStatuses>().oneOf(Object.values(AccountStatuses) as AccountStatuses[], 'Please select the status'),
    });

    return { validationScheme, initialValues };
};
