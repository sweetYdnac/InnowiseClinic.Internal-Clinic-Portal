import { Box, Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { AppRoutes } from '../../constants/AppRoutes';
import { usePagedSpecializationsQuery } from '../../hooks/requests/specializations';
import { IPagedRequest } from '../../types/common/Requests';
import { Container } from './SpecializationsPage.styles';
import { SpecializationsTable } from './SpecializationsTable/SpecializationsTable';

export const SpecializationsPage = () => {
    const navigate = useNavigate();
    const [pagedRequestData, setPagedRequestData] = useState<IPagedRequest>({
        currentPage: 1,
        pageSize: 10,
    });

    const { data: specializations, isFetching: isSpecializationsFetching } = usePagedSpecializationsQuery(
        { currentPage: pagedRequestData.currentPage, pageSize: pagedRequestData.pageSize, isActive: null },
        true
    );

    const handleChangePage = useCallback((page: number) => {
        setPagedRequestData((prev) => ({
            ...prev,
            currentPage: page,
        }));
    }, []);

    return (
        <Container>
            <Container>
                <Button onClick={() => navigate(AppRoutes.CreateSpecialization)}>Create</Button>
            </Container>
            <Box>
                {specializations && (
                    <SpecializationsTable
                        specializations={specializations.items}
                        pagingData={{
                            currentPage: specializations.currentPage,
                            pageSize: specializations.pageSize,
                            totalCount: specializations.totalCount,
                            totalPages: specializations.totalPages,
                        }}
                        handlePageChange={(_, page) => handleChangePage(page + 1)}
                    />
                )}
            </Box>

            {isSpecializationsFetching && <Loader />}
        </Container>
    );
};
