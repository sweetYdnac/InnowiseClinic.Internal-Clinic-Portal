import { yupResolver } from '@hookform/resolvers/yup';
import { AccountCircle } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { Datepicker } from '../../components/DatePicker/Datepicker';
import { Loader } from '../../components/Loader/Loader';
import { Textfield } from '../../components/Textfield/Textfield';
import { usePagedOffices } from '../../hooks/offices';
import { usePagedSpecializations } from '../../hooks/specializations';
import { useCreateDoctorValidator } from '../../hooks/validators/doctors/createDoctor';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

export const CreateDoctorPage = () => {
    const { initialValues, validationScheme } = useCreateDoctorValidator();
    const { register, control, watch, getValues, setValue } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const {
        data: specializations,
        isFetching: isSpecializationsFetching,
        refetch: fetchSpecializations,
    } = usePagedSpecializations({
        currentPage: 1,
        pageSize: 20,
        isActive: true,
        title: watch('specializationInput'),
    });

    const {
        data: offices,
        isFetching: isOfficesFetching,
        refetch: fetchOffices,
    } = usePagedOffices({ currentPage: 1, pageSize: 50, isActive: true });

    return (
        <>
            <Box
                // onSubmit={handleSubmit(() => createAppointment())}
                component='form'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
                noValidate
                autoComplete='on'
            >
                <Typography variant='h5' gutterBottom>
                    Create Doctor
                </Typography>

                <Textfield id={register('firstName').name} control={control} displayName='First name' workMode='edit' />
                <Textfield id={register('lastName').name} control={control} displayName='Last name' workMode='edit' />
                <Textfield id={register('middleName').name} control={control} displayName='Middle name' workMode='edit' />

                <Datepicker
                    id={register('dateOfBirth').name}
                    control={control}
                    displayName='Date of birth'
                    openTo='year'
                    disablePast={false}
                    disableFuture={true}
                />

                <Textfield
                    id={register('email').name}
                    control={control}
                    inputMode='email'
                    displayName='Email'
                    placeholder='example@gmail.com'
                    workMode='edit'
                    startAdornment={<AccountCircle />}
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

                <Datepicker
                    id={register('careerStartYear').name}
                    control={control}
                    displayName='Career start year'
                    views={['year']}
                    openTo='year'
                    disablePast={false}
                    disableFuture={true}
                />
            </Box>

            {false && <Loader />}
        </>
    );
};
