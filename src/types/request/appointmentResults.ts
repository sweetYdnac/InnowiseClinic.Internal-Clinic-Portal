export interface ICreateAppointmentResultRequest {
    Id: string;
    patientFullName: string;
    patientDateOfBirth: string;
    doctorFullName: string;
    doctorSpecializationName: string;
    serviceName: string;
    complaints: string;
    conclusion: string;
    recommendations: string;
}

export interface IUpdateAppointmentResultRequest extends Omit<ICreateAppointmentResultRequest, 'id'> {
    date: string;
}
