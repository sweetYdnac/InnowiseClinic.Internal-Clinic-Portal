import dayjs from 'dayjs';
import * as yup from 'yup';

interface ICreateAppointmentForm {
    officeId: string;
    officeInput: string;
    doctorId: string;
    doctorInput: string;
    specializationId: string;
    specializationInput: string;
    serviceId: string;
    serviceInput: string;
    date: dayjs.Dayjs;
    time: dayjs.Dayjs | null;
}

export const useCreateAppointmentValidator = () => {
    const initialValues: ICreateAppointmentForm = {
        officeId: '',
        officeInput: '',
        doctorId: '',
        doctorInput: '',
        specializationId: '',
        specializationInput: '',
        serviceId: '',
        serviceInput: '',
        date: dayjs(),
        time: null,
    };

    const validationScheme = yup.object().shape({
        officeId: yup.string().required('Please, choose the office'),
        officeInput: yup.string().notRequired(),
        doctorId: yup.string().required('Please, choose the doctor'),
        doctorInput: yup.string().notRequired(),
        specializationId: yup.string().required('Please, choose the specialization'),
        specializationInput: yup.string().notRequired(),
        serviceId: yup.string().required('Please, choose the service'),
        serviceInput: yup.string().notRequired(),
        date: yup.date().required('Please, enter a valid date').typeError('Please, enter a valid date'),
        time: yup.date().required('Please, enter a valid timeslot').typeError('Please, enter a valid timeslot'),
    });

    return { validationScheme, initialValues };
};
