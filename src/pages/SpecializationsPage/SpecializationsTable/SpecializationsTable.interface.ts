import { IPagingData } from '../../../types/common/Responses';
import { ISpecializationResponse } from '../../../types/response/specializations';

export interface SpecializationsTableProps {
    specializations: ISpecializationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}
