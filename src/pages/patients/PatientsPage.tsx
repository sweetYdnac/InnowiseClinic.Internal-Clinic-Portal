import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FilterTextfield } from '../../components/FilterTextfield/FilterTextfield';
import { Loader } from '../../components/Loader/Loader';
import { usePagedPatientsQuery } from '../../hooks/requests/patients';
import { useGetPatientsValidator } from '../../hooks/validators/patients/getPaged';
import { AppRoutes } from '../../routes/AppRoutes';
import { PatientsTable } from './PatientsTable';

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
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button onClick={() => navigate(AppRoutes.CreatePatient)}>Create</Button>
                    <FilterTextfield
                        valueFieldName={register('fullName').name}
                        inputFieldName={register('patientInput').name}
                        control={control}
                        displayName='Patient'
                        debounceDelay={2000}
                    />
                </Box>
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
            </Box>

            {isFetchingPatients && <Loader />}
        </Box>
    );
};
