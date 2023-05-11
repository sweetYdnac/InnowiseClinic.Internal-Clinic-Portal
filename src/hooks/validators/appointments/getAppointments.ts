import dayjs from 'dayjs';
import * as yup from 'yup';

export interface IGetAppointmentsForm {
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
    const initialValues: IGetAppointmentsForm = {
        date: dayjs(),
        doctorId: '',
        doctorInput: '',
        serviceId: '',
        serviceInput: '',
        officeId: '',
        officeInput: '',
        specializationId: '',
        isApproved: null,
    };

    const validationScheme = yup.object().shape({
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

    return { validationScheme, initialValues };
};
