import { IPagingData } from '../../../types/common/Responses';
import { IReceptionistsInformationResponse } from '../../../types/response/receptionists';

export interface ReceptionistsTableProps {
    receptionists: IReceptionistsInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}
