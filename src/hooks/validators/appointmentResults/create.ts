import dayjs from 'dayjs';
import { dateApiFormat } from '../../../constants/Formats';
import { ICreateAppointmentResultDTO } from '../../../types/dto/appointmentResults';
import { Yup } from '../YupConfiguration';
import { IAppointmentResultForm, appointmentResultValidationScheme } from './common';

export const useCreateAppointmentResultValidator = (dto: ICreateAppointmentResultDTO, appointmentId: string) => {
    const initialValues = {
        date: dayjs(),
        patientFullName: dto.patientFullName,
        patientDateOfBirth: dayjs(dto.patientDateOfBirth, dateApiFormat),
        doctorFullName: dto.doctorFullName,
        doctorSpecializationName: dto.doctorSpecializationName,
        serviceName: dto.serviceName,
        complaints: '',
        conclusion: '',
        recommendations: '',
        appointmentId: appointmentId,
    } as IAppointmentResultForm;

    const requestValidationScheme = Yup.object().shape({
        recommendations: Yup.string().required(),
    });

    return { formValidationScheme: appointmentResultValidationScheme, requestValidationScheme, initialValues };
};
