import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { FilterTextfield } from '../../components/UI/FilterTextfield';
import { usePagedPatientsQuery } from '../../hooks/requests/patients';
import { useGetPatientsValidator } from '../../hooks/validators/patients/getPaged';
import { AppRoutes } from '../../constants/AppRoutes';
import { PatientsTable } from './PatientsTable/PatientsTable';
import { Container } from './PatientsPage.styles';

export const PatientsPage = () => {
    const navigate = useNavigate();
    const { initialValues, validationScheme } = useGetPatientsValidator();
    const { register, control, watch, setValue } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { data: patients, isFetching: isFetchingPatients } = usePagedPatientsQuery(
        {
            currentPage: watch('currentPage'),
            pageSize: watch('pageSize'),
            fullName: watch('fullName'),
        },
        true
    );

    useEffect(() => {
        setValue('currentPage', 1);
    }, [watch('fullName')]);

    return (
        <Container>
            <Container>
                <Button onClick={() => navigate(AppRoutes.CreatePatient)}>Create</Button>
                <FilterTextfield
                    valueFieldName={register('fullName').name}
                    inputFieldName={register('patientInput').name}
                    control={control}
                    displayName='Patient'
                    debounceDelay={2000}
                />
            </Container>
            <Box>
                {patients && (
                    <PatientsTable
                        patients={patients.items}
                        pagingData={{
                            currentPage: patients.currentPage,
                            pageSize: patients.pageSize,
                            totalCount: patients.totalCount,
                            totalPages: patients.totalPages,
                        }}
                        handlePageChange={(_, page) => setValue('currentPage', page + 1)}
                    />
                )}
            </Box>

            {isFetchingPatients && <Loader />}
        </Container>
    );
};
