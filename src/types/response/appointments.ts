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

export interface ITimeSlot {
    doctors: string[];
    time: string;
    // parsedTime: dayjs.Dayjs;
}

export interface ITimeSlotsResponse {
    timeSlots: ITimeSlot[];
}
