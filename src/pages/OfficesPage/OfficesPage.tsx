import { Box, Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { AppRoutes } from '../../constants/AppRoutes';
import { usePagedOfficesQuery } from '../../hooks/requests/offices';
import { IPagedRequest } from '../../types/common/Requests';
import { Container } from './OfficesPage.styles';
import { OfficesTable } from './OfficesTable/OfficesTable';

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
        <Container>
            <Container>
                <Button onClick={() => navigate(AppRoutes.CreateOffice)}>Create</Button>
            </Container>
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
        </Container>
    );
};
