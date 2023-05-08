import dayjs from 'dayjs';
import * as yup from 'yup';
import { IAutoCompleteInput } from '../../types/common/Autocomplete';

interface ICreateAppointmentForm {
    office: IAutoCompleteInput;
    doctor: IAutoCompleteInput;
    specialization: IAutoCompleteInput;
    service: IAutoCompleteInput;
    date: dayjs.Dayjs;
    time: dayjs.Dayjs | null;
}

export const useCreateAppointmentValidator = () => {
    const initialValues: ICreateAppointmentForm = {
        office: {
            id: null,
            input: '',
        },
        doctor: {
            id: null,
            input: '',
        },
        specialization: {
            id: null,
            input: '',
        },
        service: {
            id: null,
            input: '',
        },
        date: dayjs(),
        time: null,
    };

    const validationScheme = yup.object().shape({
        office: yup.object().shape({
            id: yup.string().required('Please, choose the office'),
            input: yup.string().notRequired(),
        }),
        doctor: yup.object().shape({
            id: yup.string().required('Please, choose the doctor'),
            input: yup.string().notRequired(),
        }),
        specialization: yup.object().shape({
            id: yup.string().required('Please, choose the specialization'),
            input: yup.string().notRequired(),
        }),
        service: yup.object().shape({
            id: yup.string().required('Please, choose the service'),
            input: yup.string().notRequired(),
        }),
        date: yup.date().required('Please, enter a valid date').typeError('Please, enter a valid date'),
        time: yup.date().required('Please, enter a valid timeslot').typeError('Please, enter a valid timeslot'),
    });

    return { validationScheme, initialValues };
};
