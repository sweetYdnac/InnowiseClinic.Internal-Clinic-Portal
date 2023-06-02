import dayjs from 'dayjs';
import { Yup } from '../YupConfiguration';

export interface IAppointmentResultForm {
    Id: string;
    date: dayjs.Dayjs;
    patientFullName: string;
    patientDateOfBirth: dayjs.Dayjs;
    doctorId: string;
    doctorFullName: string;
    doctorSpecializationName: string;
    serviceName: string;
    complaints: string;
    conclusion: string;
    recommendations: string;
}

export const appointmentResultValidationScheme = Yup.object().shape({
    date: Yup.date().required().typeError('Please, enter a valid date'),
    patientFullName: Yup.string().required(),
    patientDateOfBirth: Yup.date().max(dayjs()).required().typeError('Please, enter a valid date'),
    doctorFullName: Yup.string().required(),
    doctorSpecializationName: Yup.string().required(),
    serviceName: Yup.string().required(),
    complaints: Yup.string().required('Please, enter complaints'),
    conclusion: Yup.string().required('Please, enter a conclusion'),
    recommendations: Yup.string().required('Please, enter recommendations'),
});
