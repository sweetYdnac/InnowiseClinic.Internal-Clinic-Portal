export interface ICreateAppointmentResultRequest {
    patientFullName: string;
    patientDateOfBirth: string;
    doctorFullName: string;
    doctorSpecializationName: string;
    serviceName: string;
    complaints: string;
    conclusion: string;
    recommendations: string;
    appointmentId: string;
}

export interface IUpdateAppointmentResultRequest extends Omit<ICreateAppointmentResultRequest, 'specializationId'> {
    date: string;
}
