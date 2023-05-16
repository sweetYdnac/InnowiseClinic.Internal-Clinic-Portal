import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Yup } from '../YupConfiguration';

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
        return Yup.object().shape({
            currentPage: Yup.number().moreThan(0, 'Page number should be greater than 0').required(),
            pageSize: Yup.number().min(1).max(50).required('Page size is required'),
            date: Yup.date().min(dayjs(), 'Date could not be past').required('Please, enter a date'),
            doctorId: Yup.string().notRequired(),
            doctorInput: Yup.string().notRequired(),
            serviceId: Yup.string().notRequired(),
            serviceInput: Yup.string().notRequired(),
            officeId: Yup.string().notRequired(),
            officeInput: Yup.string().notRequired(),
            specializationId: Yup.string().notRequired(),
            isApproved: Yup.bool().notRequired().nullable(),
        });
    }, []);

    return { validationScheme, initialValues };
};
