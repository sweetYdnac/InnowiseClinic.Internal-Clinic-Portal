import { WorkMode } from '../../constants/WorkModes';
import { IPagingData } from '../../types/common/Responses';
import { IServiceInformationResponse } from '../../types/response/services';

export interface ServicesTableProps {
    existedServices?: IServiceInformationResponse[];
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
    workMode?: WorkMode;
}
