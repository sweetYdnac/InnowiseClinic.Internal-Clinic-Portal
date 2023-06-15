import { IPagingData } from '../../../types/common/Responses';
import { IPatientInformationResponse } from '../../../types/response/patients';

export interface PatientsTableProps {
    patients: IPatientInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}
