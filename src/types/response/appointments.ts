import dayjs from 'dayjs';

export interface IAppointmentResponse {
    id: string;
    startTime: string;
    endTime: string;
    patientId: string;
    patientFullName: string;
    patientPhoneNumber: string;
    doctorFullName: string;
    serviceName: string;
    isApproved: boolean;
}

export interface IRescheduleAppointmentResponse {
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

export interface ITimeSlot {
    doctors: string[];
    time: string;
}

export interface ITimeSlotsResponse {
    timeSlots: ITimeSlot[];
}

export interface IAppointmentHistoryResponse {
    id: string;
    date: dayjs.Dayjs;
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
    doctorFullName: string;
    serviceName: string;
    isApproved: boolean;
    resultId: string | null;
}
