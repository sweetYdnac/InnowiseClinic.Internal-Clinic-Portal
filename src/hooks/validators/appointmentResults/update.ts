import dayjs from 'dayjs';
import { useMemo } from 'react';
import { dateApiFormat } from '../../../constants/Formats';
import { IAppointmentResultResponse } from '../../../types/response/appointmentResults';
import { IAppointmentResultForm, appointmentResultValidationScheme } from './common';

export const useUpdateAppointmentResultValidator = (result: IAppointmentResultResponse | undefined) => {
    const initialValues = useMemo(
        () =>
            ({
                date: dayjs(result?.date, dateApiFormat),
                patientFullName: result?.patientFullName ?? '',
                patientDateOfBirth: dayjs(result?.patientDateOfBirth),
                doctorId: result?.doctorId,
                doctorFullName: result?.doctorFullName ?? '',
                doctorSpecializationName: result?.doctorSpecializationName ?? '',
                serviceName: result?.serviceName ?? '',
                complaints: result?.complaints ?? '',
                conclusion: result?.conclusion ?? '',
                recommendations: result?.recommendations ?? '',
            } as IAppointmentResultForm),
        [
            result?.complaints,
            result?.conclusion,
            result?.date,
            result?.doctorFullName,
            result?.doctorId,
            result?.doctorSpecializationName,
            result?.patientDateOfBirth,
            result?.patientFullName,
            result?.recommendations,
            result?.serviceName,
        ]
    );

    return { validationScheme: appointmentResultValidationScheme, initialValues };
};
