export interface IAppointmentResponse {
    id: string;
    startTime: string;
    endTime: string;
    patientFullName: string;
    patientPhoneNumber: string;
    doctorFullName: string;
    serviceName: string;
    isApproved: boolean;
}
