import dayjs from 'dayjs';
import { useMemo } from 'react';
import * as yup from 'yup';
import { dateApiFormat, timeApiFormat } from '../../../constants/formats';
import { IRescheduleAppointmentResponse } from '../../../types/response/appointments';

export interface IRescheduleAppointmentForm {
    doctorId: string;
    doctorInput: string;
    date: dayjs.Dayjs | null;
    time: dayjs.Dayjs | null;
}

export const useRescheduleAppointmentValidator = (appointment?: IRescheduleAppointmentResponse) => {
    const initialValues = useMemo(() => {
        return {
            doctorId: appointment ? appointment.doctorId : '',
            doctorInput: appointment ? appointment?.doctorFullName : '',
            date: dayjs(appointment?.date, dateApiFormat) || null,
            time: dayjs(appointment?.time, timeApiFormat) || null,
        };
    }, [appointment]);

    const validationScheme = useMemo(() => {
        return yup.object().shape({
            doctorId: yup.string().required('Please choose the doctor'),
            doctorInput: yup.string().notRequired(),
            date: yup.date().required('Please enter a valid date').typeError('Please enter a valid date'),
            time: yup.date().required('Please enter a valid timeslot').typeError('Please enter a valid timeslot'),
        });
    }, []);

    return { initialValues, validationScheme };
};
