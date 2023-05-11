import dayjs from 'dayjs';
import * as yup from 'yup';

export interface ICreateAppointmentForm {
    patientId: string;
    patientInput: string;
    officeId: string;
    officeInput: string;
    doctorId: string;
    doctorInput: string;
    specializationId: string;
    specializationInput: string;
    serviceId: string;
    serviceInput: string;
    date: dayjs.Dayjs | null;
    time: dayjs.Dayjs | null;
}

export const useCreateAppointmentValidator = () => {
    const initialValues: ICreateAppointmentForm = {
        patientId: '',
        patientInput: '',
        officeId: '',
        officeInput: '',
        doctorId: '',
        doctorInput: '',
        specializationId: '',
        specializationInput: '',
        serviceId: '',
        serviceInput: '',
        date: null,
        time: null,
    };

    const validationScheme = yup.object().shape({
        patientId: yup.string().required('Please, choose the patient'),
        patientInput: yup.string().notRequired(),
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
