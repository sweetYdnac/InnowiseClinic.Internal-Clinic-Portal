import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { AppRoutes } from '../../constants/AppRoutes';
import { usePagedReceptionistsQuery } from '../../hooks/requests/receptionists';
import { useGetReceptionistsValidator } from '../../hooks/validators/receptionists/getPaged';
import { IPagedRequest } from '../../types/common/Requests';
import { ReceptionistsTable } from './ReceptionistsTable/ReceptionistsTable';

export const ReceptionistsPage = () => {
    const navigate = useNavigate();
    const { initialValues, validationScheme } = useGetReceptionistsValidator({ currentPage: 1, pageSize: 10 } as IPagedRequest);
    const { watch, setValue } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { data: receptionists, isFetching: isFetchigReceptionists } = usePagedReceptionistsQuery(watch(), true);

    return (
        <Container>
            <Container>
                <Button onClick={() => navigate(AppRoutes.CreateReceptionist)}>Create</Button>
            </Container>
            <Box>
                {receptionists && (
                    <ReceptionistsTable
                        receptionists={receptionists.items}
                        pagingData={{
                            currentPage: receptionists.currentPage,
                            pageSize: receptionists.pageSize,
                            totalCount: receptionists.totalCount,
                            totalPages: receptionists.totalPages,
                        }}
                        handlePageChange={(_, page) => setValue('currentPage', page + 1)}
                    />
                )}
            </Box>

            {isFetchigReceptionists && <Loader />}
        </Container>
    );
};
