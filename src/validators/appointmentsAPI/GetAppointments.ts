import dayjs from 'dayjs';
import * as yup from 'yup';

export interface IGetAppointmentsForm {
    currentPage: number;
    pageSize: number;
    date: dayjs.Dayjs;
    doctorFullName: string;
    serviceName: string;
    officeId: string;
    isApproved: boolean | null;
}

export const initialValues: IGetAppointmentsForm = {
    currentPage: 1,
    pageSize: 20,
    date: dayjs(),
    doctorFullName: '',
    serviceName: '',
    officeId: '',
    isApproved: null,
};

export const GET_APPOINTMENTS_VALIDATOR = yup.object().shape({
    currentPage: yup.number().moreThan(0, 'Current page should be greater than 0').required('Please, enter a page number'),
    pageSize: yup
        .number()
        .moreThan(0, 'Page size should be greater that 0')
        .max(50, 'Max page size is equals to 50')
        .required('Please, enter a page size'),
    date: yup.date().min(Date.now, 'Date should be greater or equal than today').required('Please, enter a date'),
    doctorFullName: yup.string().notRequired(),
    serviceName: yup.string().notRequired(),
    officeId: yup.string().notRequired(),
    isApproved: yup.bool().notRequired(),
});
