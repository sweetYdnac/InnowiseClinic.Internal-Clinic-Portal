import { IPagingData } from '../../../types/common/Responses';
import { IDoctorScheduledAppointmentResponse } from '../../../types/response/doctors';

export interface DoctorScheduleTableProps {
    appointments: IDoctorScheduledAppointmentResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}
