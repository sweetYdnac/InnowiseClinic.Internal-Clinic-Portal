import { IPagingData } from '../../../types/common/Responses';
import { IDoctorInformationResponse } from '../../../types/response/doctors';

export interface DoctorsTableProps {
    doctors: IDoctorInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}
