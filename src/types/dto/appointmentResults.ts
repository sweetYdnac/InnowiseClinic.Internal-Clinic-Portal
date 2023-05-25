import { IDoctorScheduledAppointmentResponse } from '../response/doctors';

export interface ICreateAppointmentResultDTO
    extends Pick<
        IDoctorScheduledAppointmentResponse,
        'patientFullName' | 'patientDateOfBirth' | 'doctorFullName' | 'doctorSpecializationName' | 'serviceName'
    > {}
