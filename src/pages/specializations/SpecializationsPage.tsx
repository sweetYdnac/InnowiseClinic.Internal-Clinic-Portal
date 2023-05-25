import { Box, Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { usePagedSpecializationsQuery } from '../../hooks/requests/specializations';
import { AppRoutes } from '../../routes/AppRoutes';
import { IPagedRequest } from '../../types/common/Requests';
import { SpecializationsTable } from './SpecializationsTable';

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
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Button onClick={() => navigate(AppRoutes.CreateSpecialization)}>Create</Button>
            </Box>
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
        </Box>
    );
};
