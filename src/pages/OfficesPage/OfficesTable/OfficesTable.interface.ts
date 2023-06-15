import { IPagingData } from '../../../types/common/Responses';
import { IOfficeInformationResponse } from '../../../types/response/offices';

export interface OfficesTableProps {
    offices: IOfficeInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}
