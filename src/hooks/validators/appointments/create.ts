import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Yup } from '../YupConfiguration';

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
    const initialValues = useMemo(() => {
        return {
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
        } as ICreateAppointmentForm;
    }, []);

    const validationScheme = useMemo(() => {
        return Yup.object().shape({
            patientId: Yup.string().required('Please, choose the patient'),
            patientInput: Yup.string().notRequired(),
            officeId: Yup.string().required('Please, choose the office'),
            officeInput: Yup.string().notRequired(),
            doctorId: Yup.string().required('Please, choose the doctor'),
            doctorInput: Yup.string().notRequired(),
            specializationId: Yup.string().required('Please, choose the specialization'),
            specializationInput: Yup.string().notRequired(),
            serviceId: Yup.string().required('Please, choose the service'),
            serviceInput: Yup.string().notRequired(),
            date: Yup.date()
                .min(dayjs(), 'Date could not be past')
                .required('Please, enter a valid date')
                .typeError('Please, enter a valid date'),
            time: Yup.date().required('Please, enter a valid timeslot').typeError('Please, enter a valid timeslot'),
        });
    }, []);

    return { validationScheme, initialValues };
};
