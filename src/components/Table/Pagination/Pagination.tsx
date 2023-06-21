import { FunctionComponent } from 'react';
import { PaginationProps } from './Pagination.interface';
import { StyledPagination } from './Pagination.styles';

export const Pagination: FunctionComponent<PaginationProps> = ({ pagingData, handlePageChange }) => {
    return (
        <StyledPagination
            component='div'
            count={pagingData.totalCount}
            rowsPerPage={pagingData.pageSize}
            page={pagingData.currentPage - 1}
            rowsPerPageOptions={[]}
            onPageChange={handlePageChange}
        />
    );
};
