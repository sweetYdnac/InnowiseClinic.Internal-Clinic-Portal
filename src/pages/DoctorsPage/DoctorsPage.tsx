import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { AutoComplete } from '../../components/UI/AutoComplete';
import { FilterTextfield } from '../../components/UI/FilterTextfield';
import { AppRoutes } from '../../constants/AppRoutes';
import { usePagedDoctorsQuery } from '../../hooks/requests/doctors';
import { usePagedOfficesQuery } from '../../hooks/requests/offices';
import { usePagedSpecializationsQuery } from '../../hooks/requests/specializations';
import { useDoctorsValidator } from '../../hooks/validators/doctors/getPaged';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { Container } from './DoctorsPage.styles';
import { DoctorsTable } from './DoctorsTable/DoctorsTable';

export const DoctorsPage = () => {
    const navigate = useNavigate();
    const { validationScheme, initialValues } = useDoctorsValidator();
    const { register, control, watch, getValues, setValue } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const {
        data: offices,
        isFetching: isOfficesFetching,
        refetch: fetchOffices,
    } = usePagedOfficesQuery({ currentPage: 1, pageSize: 50, isActive: true });

    const {
        data: specializations,
        isFetching: isSpecializationsFetching,
        refetch: fetchSpecializations,
    } = usePagedSpecializationsQuery({
        currentPage: 1,
        pageSize: 20,
        isActive: true,
        title: watch('specializationInput'),
    });

    const { data: doctors, isFetching: isFetchingDoctors } = usePagedDoctorsQuery(
        {
            currentPage: watch('currentPage'),
            pageSize: watch('pageSize'),
            onlyAtWork: false,
            officeId: watch('officeId'),
            specializationId: watch('specializationId'),
            fullName: watch('doctorValue'),
        },
        true
    );

    useEffect(() => {
        setValue('currentPage', 1);
    }, [watch('pageSize'), watch('officeId'), watch('specializationId'), watch('doctorValue')]);

    return (
        <Container>
            <Container>
                <Button onClick={() => navigate(AppRoutes.CreateDoctor)}>Create</Button>
                <FilterTextfield
                    valueFieldName={register('doctorValue').name}
                    inputFieldName={register('doctorInput').name}
                    control={control}
                    displayName='Doctor'
                    debounceDelay={2000}
                />

                <AutoComplete
                    valueFieldName={register('officeId').name}
                    control={control}
                    displayName='Office'
                    options={
                        offices?.items?.map((item) => {
                            return {
                                label: item.address,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    isFetching={isOfficesFetching}
                    handleOpen={() => {
                        if (!getValues('officeId')) {
                            fetchOffices();
                        }
                    }}
                    handleInputChange={() => fetchOffices()}
                    inputFieldName={register('officeInput').name}
                    debounceDelay={2000}
                />

                <AutoComplete
                    valueFieldName={register('specializationId').name}
                    control={control}
                    displayName='Specialization'
                    options={
                        specializations?.items.map((item) => {
                            return {
                                label: item.title,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    isFetching={isSpecializationsFetching}
                    handleOpen={() => {
                        if (!getValues('specializationId')) {
                            fetchSpecializations();
                        }
                    }}
                    handleInputChange={() => fetchSpecializations()}
                    inputFieldName={register('specializationInput').name}
                    debounceDelay={2000}
                />
            </Container>
            <Box>
                {doctors && (
                    <DoctorsTable
                        doctors={doctors.items}
                        pagingData={{
                            currentPage: doctors.currentPage,
                            pageSize: doctors.pageSize,
                            totalCount: doctors.totalCount,
                            totalPages: doctors.totalPages,
                        }}
                        handlePageChange={(_, page) => setValue('currentPage', page + 1)}
                    />
                )}
            </Box>

            {isFetchingDoctors && <Loader />}
        </Container>
    );
};
