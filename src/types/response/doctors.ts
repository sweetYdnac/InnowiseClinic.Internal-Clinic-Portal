import { IEmployeeProfile, IPagedResponse } from '../common/Responses';

export interface IDoctorResponse extends IEmployeeProfile {
    dateOfBirth: string;
    specializationId: string;
    specializationName: string;
    careerStartYear: number;
    status: number;
}

export interface IDoctorInformationResponse {
    id: string;
    fullName: string;
    specializationId: string;
    specializationName: string;
    officeId: string;
    officeAddress: string;
    experience: number;
    dateOfBirth: string;
    status: number;
    photoId: string;
}

export interface IPagedDoctorsResponse extends IPagedResponse<IDoctorInformationResponse> {}

export interface IDoctorScheduledAppointmentResponse {
    id: string;
    startTime: string;
    endTime: string;
    patientId: string;
    patientFullName: string;
    patientDateOfBirth: string;
    doctorFullName: string;
    doctorSpecializationName: string;
    serviceName: string;
    isApproved: boolean;
    resultId: string | null;
}

export interface IDoctorScheduleReponse extends IPagedResponse<IDoctorScheduledAppointmentResponse> {}
