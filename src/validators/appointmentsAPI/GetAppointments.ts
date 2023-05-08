import dayjs from 'dayjs';
import * as yup from 'yup';
import { IAutoCompleteInput } from '../../types/common/Autocomplete';

export interface IGetAppointmentsForm {
    date: dayjs.Dayjs;
    doctorFullName: string;
    service: IAutoCompleteInput;
    office: IAutoCompleteInput;
    isApproved: boolean | null;
}

export const initialValues: IGetAppointmentsForm = {
    date: dayjs(),
    doctorFullName: '',
    service: {
        id: '',
        input: '',
    },
    office: {
        id: '',
        input: '',
    },
    isApproved: null,
};

export const GET_APPOINTMENTS_VALIDATOR = yup.object().shape({
    date: yup.date().min(dayjs(), 'Date should be greater or equal than today').required('Please, enter a date'),
    doctorFullName: yup.string().notRequired(),
    service: yup.object().shape({
        id: yup.string().notRequired(),
        input: yup.string().notRequired(),
    }),
    officeId: yup.string().notRequired(),
    isApproved: yup.bool().notRequired().nullable(),
});
