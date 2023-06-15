import dayjs from 'dayjs';
import { IPagingData } from '../../../types/common/Responses';
import { IAppointmentResponse } from '../../../types/response/appointments';

export interface AppointmentsListProps {
    date: dayjs.Dayjs;
    appointments: IAppointmentResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}
