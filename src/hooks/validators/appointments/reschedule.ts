import dayjs from 'dayjs';
import { useMemo } from 'react';
import { dateApiFormat, timeApiFormat } from '../../../constants/Formats';
import { IRescheduleAppointmentResponse } from '../../../types/response/appointments';
import { Yup } from '../YupConfiguration';

export interface IRescheduleAppointmentForm {
    doctorId: string;
    doctorInput: string;
    date: dayjs.Dayjs | null;
    time: dayjs.Dayjs | null;
}

export const useRescheduleAppointmentValidator = (appointment?: IRescheduleAppointmentResponse) => {
    const initialValues = useMemo(
        () =>
            ({
                doctorId: appointment ? appointment.doctorId : '',
                doctorInput: appointment ? appointment?.doctorFullName : '',
                date: dayjs(appointment?.date, dateApiFormat) || undefined,
                time: dayjs(appointment?.time, timeApiFormat) || null,
            } as IRescheduleAppointmentForm),
        [appointment]
    );

    const validationScheme = Yup.object().shape({
        doctorId: Yup.string().required('Please choose the doctor'),
        doctorInput: Yup.string().notRequired(),
        date: Yup.date()
            .min(dayjs().subtract(1, 'day'), 'Date could not be past')
            .required('Please, enter a date')
            .typeError('Please, enter a valid date'),
        time: Yup.date().required('Please, enter a valid timeslot').typeError('Please, enter a valid timeslot'),
    });

    return { initialValues, validationScheme };
};
