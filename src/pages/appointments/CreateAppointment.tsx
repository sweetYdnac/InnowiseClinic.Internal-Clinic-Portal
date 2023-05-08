import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { usePagedOffices } from '../../hooks/offices';
import { usePagedSpecializations } from '../../hooks/specializations';
import { IPagingData } from '../../types/common/Responses';
import { useCreateAppointmentValidator } from '../../validators/appointmentsAPI/CreateAppointment';

const CreateAppointment = () => {
    const { validationScheme, initialValues } = useCreateAppointmentValidator();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        getValues,
        watch,
        formState: { errors, touchedFields },
        control,
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { data: offices, isFetching: isFetchingOffices } = usePagedOffices({ currentPage: 1, pageSize: 50 } as IPagingData);
    const { data: specializations, isLoading: isLoadingSpecializations } = usePagedSpecializations(
        { currentPage: 1, pageSize: 50 } as IPagingData,
        watch('specialization').input
    );

    return (
        <>
            {/* <Box
                // onSubmit={handleSubmit()}
                component='form'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
                noValidate
                autoComplete='off'
            >
                <Typography variant='h5' gutterBottom>
                    Create Appointment
                </Typography>

                <AutoComplete
                    id={register('office').name}
                    displayName='Office'
                    control={control}
                    options={
                        offices?.map((item) => {
                            return {
                                label: item.address,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                />

                <AutoComplete
                    disabled={!getValues('officeId')}
                    id={register('specializationId').name}
                    displayName='Specialization'
                    control={control}
                    options={options.specializations.map((item) => {
                        return {
                            label: item.title,
                            id: item.id,
                        } as IAutoCompleteItem;
                    })}
                />

                <AutoComplete
                    disabled={!getValues('officeId')}
                    id={register('doctorId').name}
                    displayName='Doctor'
                    control={control}
                    options={options.doctors.map((item) => {
                        return {
                            label: item.fullName,
                            id: item.id,
                        } as IAutoCompleteItem;
                    })}
                />

                <AutoComplete
                    disabled={!getValues('officeId')}
                    id={register('serviceId').name}
                    displayName='Service'
                    control={control}
                    options={options.services.map((item) => {
                        return {
                            label: item.title,
                            id: item.id,
                        } as IAutoCompleteItem;
                    })}
                />

                <Datepicker
                    readOnly={(options.doctors.length === 0 || !getValues('doctorId')) && !getValues('serviceId')}
                    disabled={(options.doctors.length === 0 || !getValues('doctorId')) && !getValues('serviceId')}
                    id={register('date').name}
                    displayName='Date'
                    control={control}
                    disableFuture={false}
                    disablePast={true}
                    openTo={'day'}
                />

                <TimePicker
                    readOnly={
                        (options.doctors.length === 0 && getValues('doctorId') === null) ||
                        getValues('serviceId') === null ||
                        !getValues('date')?.isValid()
                    }
                    disabled={
                        (options.doctors.length === 0 && getValues('doctorId') === null) ||
                        getValues('serviceId') === null ||
                        !getValues('date')?.isValid()
                    }
                    id={register('time').name}
                    displayName='Time slot'
                    control={control}
                    timeSlots={timeSlots}
                />

                <SubmitButton errors={errors} touchedFields={touchedFields}>
                    Create
                </SubmitButton>
            </Box>

            <CustomDialog
                isOpen={isCancelDialogOpen}
                name={modalName}
                title='Discard changes?'
                content='Do you really want to exit? Your appointment will not be saved.'
            /> */}
        </>
    );
};

export default CreateAppointment;
