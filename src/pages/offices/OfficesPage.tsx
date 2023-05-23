import { Box, Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { AppRoutes } from '../../routes/AppRoutes';
import { usePagedOfficesQuery } from '../../hooks/requests/offices';
import { IPagedRequest } from '../../types/common/Requests';
import { OfficesTable } from './OfficesTable';

export const OfficesPage = () => {
    const navigate = useNavigate();
    const [pagedRequestData, setPagedRequestData] = useState<IPagedRequest>({
        currentPage: 1,
        pageSize: 10,
    });

    const { data: offices, isFetching: isOfficesFetching } = usePagedOfficesQuery(
        { currentPage: pagedRequestData.currentPage, pageSize: pagedRequestData.pageSize, isActive: null },
        true
    );

    const handleChangePage = useCallback((page: number) => {
        setPagedRequestData((prev) => {
            return {
                ...prev,
                currentPage: page,
            };
        });
    }, []);

    return (
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Button onClick={() => navigate(AppRoutes.CreateOffice)}>Create</Button>
            </Box>
            <Box>
                {offices && (
                    <OfficesTable
                        offices={offices.items}
                        pagingData={{
                            currentPage: offices.currentPage,
                            pageSize: offices.pageSize,
                            totalCount: offices.totalCount,
                            totalPages: offices.totalPages,
                        }}
                        handlePageChange={(_, page) => handleChangePage(page + 1)}
                    />
                )}
            </Box>

            {isOfficesFetching && <Loader />}
        </Box>
    );
};
