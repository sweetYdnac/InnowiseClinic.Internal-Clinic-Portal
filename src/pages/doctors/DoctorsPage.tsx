import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { FilterTextfield } from '../../components/FilterTextfield/FilterTextfield';
import { Loader } from '../../components/Loader/Loader';
import { usePagedDoctors } from '../../hooks/doctors';
import { usePagedOffices } from '../../hooks/offices';
import { usePagedSpecializations } from '../../hooks/specializations';
import { useDoctorsValidator } from '../../hooks/validators/doctors/doctors';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

export const DoctorsPage = () => {
    const { validationScheme, initialValues } = useDoctorsValidator();
    const { register, handleSubmit, setError, control, getValues, watch, setValue } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const {
        data: offices,
        isFetching: isOfficesFetching,
        refetch: fetchOffices,
    } = usePagedOffices({ currentPage: 1, pageSize: 50 }, { isActive: true });

    const {
        data: specializations,
        isFetching: isSpecializationsFetching,
        refetch: fetchSpecializations,
    } = usePagedSpecializations(
        { currentPage: 1, pageSize: 20 },
        {
            isActive: true,
            title: watch('specializationInput'),
        }
    );

    const { data: doctors, isLoading: isDoctorsLoading } = usePagedDoctors(
        { currentPage: 1, pageSize: 20 },
        {
            onlyAtWork: true,
            officeId: watch('officeId'),
            specializationId: watch('specializationId'),
            fullName: watch('doctorFullName'),
        },
        true
    );

    return (
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FilterTextfield id={register('doctorFullName').name} control={control} displayName='Doctor' />

                    <AutoComplete
                        valueFieldName={register('officeId').name}
                        control={control}
                        displayName='Office'
                        options={
                            offices?.map((item) => {
                                return {
                                    label: item.address,
                                    id: item.id,
                                } as IAutoCompleteItem;
                            }) ?? []
                        }
                        handleFetchOptions={() => fetchOffices()}
                        isFetching={isOfficesFetching}
                        inputFieldName={register('officeInput').name}
                        debounceDelay={2000}
                    />

                    <AutoComplete
                        valueFieldName={register('specializationId').name}
                        control={control}
                        displayName='Specialization'
                        options={
                            specializations?.map((item) => {
                                return {
                                    label: item.title,
                                    id: item.id,
                                } as IAutoCompleteItem;
                            }) ?? []
                        }
                        handleFetchOptions={() => fetchSpecializations()}
                        isFetching={isSpecializationsFetching}
                        inputFieldName={register('specializationInput').name}
                        debounceDelay={2000}
                    />
                </Box>
                {/* <Box>Doctors table</Box> */}
            </Box>

            {isDoctorsLoading && <Loader />}
        </Box>
    );
};
