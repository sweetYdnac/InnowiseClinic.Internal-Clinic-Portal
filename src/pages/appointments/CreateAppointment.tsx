import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SpecializationsService } from '../../api/services/SpecializationsService';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { Datepicker } from '../../components/DatePicker/Datepicker';
import { Loader } from '../../components/Loader/Loader';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { TimeSlotPicker } from '../../components/TimeSlotPicker/TimeSlotPicker';
import { endTime, startTime } from '../../constants/WorkingDay';
import { dateApiFormat, timeApiFormat, timeViewFormat } from '../../constants/formats';
import { useCreateAppointmentCommand, useTimeSlots } from '../../hooks/appointments';
import { usePagedDoctors } from '../../hooks/doctors';
import { usePagedOffices } from '../../hooks/offices';
import { usePagedPatients } from '../../hooks/patients';
import { usePagedServices } from '../../hooks/services';
import { usePagedSpecializations } from '../../hooks/specializations';
import { useCreateAppointmentValidator } from '../../hooks/validators/appointments/create';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { ISpecializationResponse } from '../../types/response/specializations';

export const CreateAppointment = () => {
    const navigate = useNavigate();
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

    const {
        data: patients,
        isFetching: isPatientsFetching,
        refetch: fetchPatients,
    } = usePagedPatients({ currentPage: 1, pageSize: 20, fullName: watch('patientInput') });

    const {
        data: offices,
        isFetching: isOfficesFetching,
        refetch: fetchOffices,
    } = usePagedOffices({ currentPage: 1, pageSize: 50, isActive: true });

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
        data: doctors,
        isFetching: isDoctorsFetching,
        refetch: fetchDoctors,
    } = usePagedDoctors({
        currentPage: 1,
        pageSize: 20,
        onlyAtWork: true,
        officeId: watch('officeId'),
        specializationId: watch('specializationId'),
        fullName: watch('doctorInput'),
    });

    const {
        data: services,
        isFetching: isServicesFetching,
        refetch: fetchServices,
    } = usePagedServices({
        currentPage: 1,
        pageSize: 20,
        isActive: true,
        title: watch('serviceInput'),
        specializationId: watch('specializationId'),
    });

    const { mutate: createAppointment, isLoading: isCreateAppointmentLoading } = useCreateAppointmentCommand(
        {
            patientId: getValues('patientId'),
            patientFullName: getValues('patientInput'),
            patientPhoneNumber: patients?.items.find((item) => item.id === getValues('patientId'))?.phoneNumber as string,
            patientDateOfBirth: patients?.items.find((item) => item.id === getValues('patientId'))?.dateOfBirth as string,
            doctorId: getValues('doctorId'),
            doctorFullName: getValues('doctorInput'),
            specializationId: getValues('specializationId'),
            doctorSpecializationName: getValues('specializationInput'),
            serviceId: getValues('serviceId'),
            serviceName: getValues('serviceInput'),
            duration: services?.items.find((item) => item.id === getValues('serviceId'))?.duration as number,
            officeId: getValues('officeId'),
            officeAddress: getValues('officeInput'),
            date: getValues('date')?.format(dateApiFormat) as string,
            time: getValues('time')?.format(timeApiFormat) as string,
        },
        navigate,
        setError
    );

    useEffect(() => {
        if (getValues('specializationId') === '') {
            setValue('serviceId', '', { shouldValidate: true });
        }
    }, [getValues('specializationId')]);

    useEffect(() => {
        if (getValues('doctorId') === '') {
            setValue('specializationId', '', { shouldValidate: true });
            return;
        }

        const doctor = doctors?.items?.find((item) => item.id === getValues('doctorId'));

        if (doctor) {
            const specialization: ISpecializationResponse = {
                id: doctor.specializationId,
                title: doctor.specializationName,
                isActive: true,
            };

            specializations?.items.push(specialization);
            setValue('specializationId', doctor.specializationId, { shouldTouch: true, shouldValidate: true });
        }
    }, [getValues('doctorId')]);

    useEffect(() => {
        if (getValues('serviceId') === '') {
            setValue('time', null, { shouldValidate: true });
            return;
        }

        const getSpecialization = async () => {
            const id = services?.items.find((item) => item.id === watch('serviceId'))?.specializationId;
            let specialization = specializations?.items.find((item) => item.id === id);

            if (!specialization) {
                if (id) {
                    specialization = await SpecializationsService.getById(id);
                    setValue('specializationId', specialization.id, { shouldValidate: true, shouldTouch: true });
                    specializations?.items.push(specialization);
                }
            } else {
                setValue('specializationId', specialization.id, { shouldValidate: true, shouldTouch: true });
            }
        };

        getSpecialization();
    }, [getValues('serviceId')]);

    useEffect(() => {
        setValue('time', null, { shouldValidate: true });
    }, [getValues('date')]);

    const {
        data: timeSlots,
        isFetching: isTimeSlotsFetching,
        refetch: fetchTimeSlots,
    } = useTimeSlots({
        date: watch('date')?.format(dateApiFormat) ?? '',
        doctors: watch('doctorId') ? [watch('doctorId')] : doctors?.items?.map((item) => item.id) ?? [],
        duration: services?.items.find((item) => item.id === watch('serviceId'))?.duration ?? 10,
        startTime: startTime.format(timeViewFormat),
        endTime: endTime.format(timeViewFormat),
    });

    const getDoctorsFromTimeSlot = () => {
        const selectedTime = getValues('time')?.format(timeViewFormat);
        const filteredDoctors = doctors?.items?.filter((doctor) => {
            const timeslot = timeSlots?.find((slot) => slot.time === selectedTime);
            return !timeslot || timeslot.doctors.includes(doctor.id);
        });

        return (
            filteredDoctors?.map(
                (doctor) =>
                    ({
                        label: doctor.fullName,
                        id: doctor.id,
                    } as IAutoCompleteItem)
            ) || []
        );
    };

    return (
        <>
            <Box
                onSubmit={handleSubmit(() => createAppointment())}
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
                    Create Appointment
                </Typography>

                <AutoComplete
                    valueFieldName={register('patientId').name}
                    control={control}
                    displayName='Patient'
                    options={
                        patients?.items?.map((item) => {
                            return {
                                label: item.fullName,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    isFetching={isPatientsFetching}
                    handleOpen={() => {
                        if (!getValues('patientId')) {
                            fetchPatients();
                        }
                    }}
                    handleInputChange={() => fetchPatients()}
                    inputFieldName={register('patientInput').name}
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
                    disabled={!getValues('officeId')}
                    inputFieldName={register('specializationInput').name}
                    debounceDelay={2000}
                />

                <AutoComplete
                    valueFieldName={register('doctorId').name}
                    control={control}
                    displayName='Doctor'
                    options={getDoctorsFromTimeSlot() ?? []}
                    isFetching={isDoctorsFetching}
                    handleOpen={() => {
                        if (!getValues('doctorId')) {
                            fetchDoctors();
                        }
                    }}
                    handleInputChange={() => fetchDoctors()}
                    disabled={!getValues('officeId')}
                    inputFieldName={register('doctorInput').name}
                    debounceDelay={2000}
                />

                <AutoComplete
                    valueFieldName={register('serviceId').name}
                    control={control}
                    displayName='Service'
                    options={
                        services?.items.map((item) => {
                            return {
                                label: item.title,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    isFetching={isServicesFetching}
                    handleOpen={() => {
                        if (!getValues('serviceId')) {
                            fetchServices();
                        }
                    }}
                    handleInputChange={() => fetchServices()}
                    disabled={!getValues('officeId')}
                    inputFieldName={register('serviceInput').name}
                    debounceDelay={2000}
                />

                <Datepicker
                    disabled={!getValues('serviceId') || (!doctors && !getValues('doctorId'))}
                    id={register('date').name}
                    control={control}
                    displayName='Date'
                />

                <TimeSlotPicker
                    id={register('time').name}
                    control={control}
                    displayName='Time slot'
                    timeSlots={timeSlots ?? []}
                    handleOpen={() => fetchTimeSlots()}
                    disabled={
                        (doctors?.items?.length === 0 && !getValues('doctorId')) ||
                        !getValues('serviceId') ||
                        !getValues('date')?.isValid() ||
                        isTimeSlotsFetching
                    }
                    isLoading={isTimeSlotsFetching}
                />

                <SubmitButton
                    errors={errors}
                    touchedFields={touchedFields}
                    shouldBeTouched={[
                        touchedFields.patientId,
                        touchedFields.officeId,
                        touchedFields.specializationId,
                        touchedFields.doctorId,
                        touchedFields.serviceId,
                        touchedFields.date as boolean,
                        touchedFields.time as boolean,
                    ]}
                >
                    Create
                </SubmitButton>
            </Box>

            {isCreateAppointmentLoading && <Loader />}
        </>
    );
};
