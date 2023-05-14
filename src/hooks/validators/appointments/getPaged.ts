import dayjs from 'dayjs';
import { useMemo } from 'react';
import * as yup from 'yup';

export interface IGetAppointmentsForm {
    currentPage: number;
    pageSize: number;
    date: dayjs.Dayjs;
    doctorId: string;
    doctorInput: string;
    serviceId: string;
    serviceInput: string;
    officeId: string;
    officeInput: string;
    specializationId: string;
    isApproved: boolean | null;
}

export const useAppointmentsValidator = () => {
    const initialValues = useMemo(() => {
        return {
            currentPage: 1,
            pageSize: 5,
            date: dayjs(),
            doctorId: '',
            doctorInput: '',
            serviceId: '',
            serviceInput: '',
            officeId: '',
            officeInput: '',
            specializationId: '',
            isApproved: null,
        } as IGetAppointmentsForm;
    }, []);

    const validationScheme = useMemo(() => {
        return yup.object().shape({
            currentPage: yup.number().moreThan(0, 'Page number should be greater than 0').required(),
            pageSize: yup.number().min(1).max(50).required(),
            date: yup.date().min(dayjs(), 'Date should be greater or equal than today').required('Please, enter a date'),
            doctorId: yup.string().notRequired(),
            doctorInput: yup.string().notRequired(),
            serviceId: yup.string().notRequired(),
            serviceInput: yup.string().notRequired(),
            officeId: yup.string().notRequired(),
            officeInput: yup.string().notRequired(),
            specializationId: yup.string().notRequired(),
            isApproved: yup.bool().notRequired().nullable(),
        });
    }, []);

    return { validationScheme, initialValues };
};
