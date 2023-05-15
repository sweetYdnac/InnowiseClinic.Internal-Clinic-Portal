import { IPagedRequest } from '../common/Requests';

export interface IGetAppointmentsRequest extends IPagedRequest {
    date: string;
    doctorFullName: string;
    serviceId: string;
    officeId: string;
    isApproved: boolean | null;
}

export interface IGetTimeSlotsRequest {
    date: string;
    doctors: string[];
    duration: number;
    startTime: string;
    endTime: string;
}

export interface ICreateAppointmentRequest {
    patientId: string;
    patientFullName: string;
    patientPhoneNumber: string;
    patientDateOfBirth: string;
    doctorId: string;
    doctorFullName: string;
    specializationId: string;
    doctorSpecializationName: string;
    serviceId: string;
    serviceName: string;
    duration: number;
    officeId: string;
    officeAddress: string;
    date: string;
    time: string;
}

export interface IRescheduleAppointmentRequest {
    doctorId: string;
    doctorFullName: string;
    date: string;
    time: string;
}
