import dayjs from 'dayjs';
import { useMemo } from 'react';
import * as yup from 'yup';
import { AccountStatuses } from '../../../constants/AccountStatuses';
import { dateApiFormat } from '../../../constants/formats';
import { IDoctorResponse } from '../../../types/response/doctors';

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
    const initialValues = useMemo(() => {
        return {
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
        } as IUpdateDoctorForm;
    }, [
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
    ]);

    const validationScheme = useMemo(() => {
        return yup.object().shape({
            photoId: yup.string().notRequired(),
            firstName: yup.string().required('Please, enter the first name'),
            lastName: yup.string().required('Please, enter the last name'),
            middleName: yup.string().notRequired(),
            dateOfBirth: yup.mixed<dayjs.Dayjs>().required('Please, select the date').typeError('Please, enter a valid date'),
            specializationId: yup.string().required('Please, choose the specialisation'),
            specializationInput: yup.string().required('Invalid specialization name'),
            officeId: yup.string().required('Please, choose the office'),
            officeInput: yup.string().required('Invalid office address'),
            careerStartYear: yup
                .mixed<dayjs.Dayjs>()
                .required('Please, select the year')
                .typeError('Please, enter a valid date')
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
