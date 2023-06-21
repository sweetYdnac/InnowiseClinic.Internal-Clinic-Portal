import { IPagingData } from '../../../types/common/Responses';

export interface PaginationProps {
    pagingData: IPagingData;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
}
