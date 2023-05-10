import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import AutoComplete from '../../components/AutoComplete/AutoComplete';
import { usePagedDoctors } from '../../hooks/doctors';
import { usePagedOffices } from '../../hooks/offices';
import { usePagedServices } from '../../hooks/services';
import { usePagedSpecializations } from '../../hooks/specializations';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { ISpecializationResponse } from '../../types/response/specializations';
import { useCreateAppointmentValidator } from '../../validators/appointmentsAPI/CreateAppointment';
import Datepicker from '../../components/DatePicker/Datepicker';

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

    const { data: offices, isFetching: isOfficesFetching, refetch: fetchOffices } = usePagedOffices({ currentPage: 1, pageSize: 50 });

    const {
        data: specializations,
        isFetching: isSpecializationsFetching,
        refetch: fetchSpecializations,
    } = usePagedSpecializations(
        { currentPage: 1, pageSize: 2 },
        {
            isActive: true,
            title: getValues('specializationInput'),
        }
    );

    const {
        data: doctors,
        isFetching: isDoctorsFetching,
        refetch: fetchDoctors,
    } = usePagedDoctors(
        { currentPage: 1, pageSize: 2 },
        {
            onlyAtWork: true,
            officeId: getValues('officeId'),
            specializationId: getValues('specializationId'),
            fullName: getValues('doctorInput'),
        }
    );

    const {
        data: services,
        isFetching: isServicesFetching,
        refetch: fetchServices,
    } = usePagedServices(
        { currentPage: 1, pageSize: 2 },
        {
            isActive: true,
            title: getValues('serviceInput'),
            specializationId: getValues('specializationId'),
        }
    );

    const handleSpecializationInputChange = useCallback(() => {
        fetchSpecializations();
    }, [fetchSpecializations]);

    const handleDoctorInputChange = useCallback(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const handleServiceInputChange = useCallback(() => {
        fetchServices();
    }, [fetchServices]);

    const specializationId = useWatch({ control: control, name: 'specializationId' });
    useEffect(() => {
        if (specializationId === '') {
            setValue('serviceId', '', { shouldValidate: true });
        }
    }, [specializationId]);

    const doctorId = useWatch({ control: control, name: 'doctorId' });
    useEffect(() => {
        if (doctorId === '') {
            setValue('specializationId', '', { shouldValidate: true });
            return;
        }

        const doctor = doctors?.find((item) => item.id === doctorId);

        if (doctor) {
            const spec: ISpecializationResponse = {
                id: doctor.specializationId,
                title: doctor.specializationName,
                isActive: true,
            };

            specializations?.push(spec);
            setValue('specializationId', doctor.specializationId, { shouldTouch: true, shouldValidate: true });
        }
    }, [doctorId]);

    const serviceId = useWatch({ control: control, name: 'serviceId' });
    useEffect(() => {
        if (serviceId === '') {
            return;
        }

        const service = services?.find((item) => item.id === serviceId);

        if (service) {
            // get specialization by id
        }
    }, [doctorId]);

    return (
        <>
            <Box
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
                    id={register('officeId').name}
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
                    handleOpen={() => fetchOffices()}
                    isLoading={isOfficesFetching}
                />

                <AutoComplete
                    id={register('specializationId').name}
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
                    handleOpen={() => fetchSpecializations()}
                    disabled={!getValues('officeId')}
                    isLoading={isSpecializationsFetching}
                    inputName={register('specializationInput').name}
                    delay={2000}
                    handleInputChange={handleSpecializationInputChange}
                />

                <AutoComplete
                    id={register('doctorId').name}
                    control={control}
                    displayName='Doctor'
                    options={
                        doctors?.map((item) => {
                            return {
                                label: item.fullName,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    handleOpen={() => fetchDoctors()}
                    disabled={!getValues('officeId')}
                    isLoading={isDoctorsFetching}
                    inputName={register('doctorInput').name}
                    delay={2000}
                    handleInputChange={handleDoctorInputChange}
                />

                <AutoComplete
                    id={register('serviceId').name}
                    control={control}
                    displayName='Service'
                    options={
                        services?.map((item) => {
                            return {
                                label: item.title,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    handleOpen={() => fetchServices()}
                    disabled={!getValues('officeId')}
                    isLoading={isServicesFetching}
                    inputName={register('serviceInput').name}
                    delay={2000}
                    handleInputChange={handleServiceInputChange}
                />

                <Datepicker
                    disabled={!getValues('serviceId') || (!doctors && !getValues('doctorId'))}
                    id={register('date').name}
                    control={control}
                    displayName='Date'
                />

                {/*<TimePicker
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
                /> */}

                {/* <SubmitButton errors={errors} touchedFields={touchedFields}>
                    Create
                </SubmitButton> */}
            </Box>

            {/* <CustomDialog
                isOpen={isCancelDialogOpen}
                name={modalName}
                title='Discard changes?'
                content='Do you really want to exit? Your appointment will not be saved.'
            /> */}
        </>
    );
};

export default CreateAppointment;
