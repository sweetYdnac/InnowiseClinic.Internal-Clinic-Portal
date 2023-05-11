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
import { useCreateAppointmentValidator } from '../../hooks/validators/appointments/createAppointment';
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
        formState: { errors, touchedFields, defaultValues },
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
    } = usePagedPatients({ currentPage: 1, pageSize: 20 }, { fullName: watch('patientInput') });

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

    const {
        data: doctors,
        isFetching: isDoctorsFetching,
        refetch: fetchDoctors,
    } = usePagedDoctors(
        { currentPage: 1, pageSize: 20 },
        {
            onlyAtWork: true,
            officeId: watch('officeId'),
            specializationId: watch('specializationId'),
            fullName: watch('doctorInput'),
        }
    );

    const {
        data: services,
        isFetching: isServicesFetching,
        refetch: fetchServices,
    } = usePagedServices(
        { currentPage: 1, pageSize: 20 },
        {
            isActive: true,
            title: watch('serviceInput'),
            specializationId: watch('specializationId'),
        }
    );

    const { mutate: createAppointment, isLoading: isCreateAppointmentLoading } = useCreateAppointmentCommand(
        {
            patientId: getValues('patientId'),
            patientFullName: patients?.find((item) => item.id === getValues('patientId'))?.fullName as string,
            patientPhoneNumber: patients?.find((item) => item.id === getValues('patientId'))?.phoneNumber as string,
            patientDateOfBirth: patients?.find((item) => item.id === getValues('patientId'))?.dateOfBirth as string,
            doctorId: getValues('doctorId'),
            doctorFullName: doctors?.find((item) => item.id === getValues('doctorId'))?.fullName as string,
            specializationId: getValues('specializationId'),
            doctorSpecializationName: specializations?.find((item) => item.id === getValues('specializationId'))?.title as string,
            serviceId: getValues('serviceId'),
            serviceName: services?.find((item) => item.id === getValues('serviceId'))?.title as string,
            duration: services?.find((item) => item.id === getValues('serviceId'))?.duration as number,
            officeId: getValues('officeId'),
            officeAddress: offices?.find((item) => item.id === getValues('officeId'))?.address as string,
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

        const doctor = doctors?.find((item) => item.id === getValues('doctorId'));

        if (doctor) {
            const specialization: ISpecializationResponse = {
                id: doctor.specializationId,
                title: doctor.specializationName,
                isActive: true,
            };

            specializations?.push(specialization);
            setValue('specializationId', doctor.specializationId, { shouldTouch: true, shouldValidate: true });
        }
    }, [getValues('doctorId')]);

    useEffect(() => {
        if (getValues('serviceId') === '') {
            setValue('time', null, { shouldValidate: true });
            return;
        }

        const getSpecialization = async () => {
            const id = services?.find((item) => item.id === watch('serviceId'))?.specializationId;
            let specialization = specializations?.find((item) => item.id === id);

            if (!specialization) {
                if (id) {
                    specialization = await SpecializationsService.getById(id);
                    setValue('specializationId', specialization.id, { shouldValidate: true, shouldTouch: true });
                    specializations?.push(specialization);
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
        doctors: watch('doctorId') ? [watch('doctorId')] : doctors?.map((item) => item.id) ?? [],
        duration: services?.find((item) => item.id === watch('serviceId'))?.duration ?? 10,
        startTime: startTime.format(timeViewFormat),
        endTime: endTime.format(timeViewFormat),
    });

    const getDoctorsFromTimeSlot = () => {
        const selectedTime = getValues('time')?.format(timeViewFormat);
        const filteredDoctors = doctors?.filter((doctor) => {
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
                    id={register('patientId').name}
                    control={control}
                    displayName='Patient'
                    options={
                        patients?.map((item) => {
                            return {
                                label: item.fullName,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    handleOpen={() => {
                        if (!getValues('patientId')) {
                            fetchPatients();
                        }
                    }}
                    isLoading={isPatientsFetching}
                    inputName={register('patientInput').name}
                    delay={2000}
                    handleInputChange={fetchPatients}
                />

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
                    handleOpen={() => {
                        if (!getValues('specializationId')) {
                            fetchSpecializations();
                        }
                    }}
                    disabled={!getValues('officeId')}
                    isLoading={isSpecializationsFetching}
                    inputName={register('specializationInput').name}
                    delay={2000}
                    handleInputChange={fetchSpecializations}
                />

                <AutoComplete
                    id={register('doctorId').name}
                    control={control}
                    displayName='Doctor'
                    options={getDoctorsFromTimeSlot() ?? []}
                    handleOpen={() => {
                        if (!getValues('time') && !getValues('doctorId')) {
                            fetchDoctors();
                        }
                    }}
                    disabled={!getValues('officeId')}
                    isLoading={isDoctorsFetching}
                    inputName={register('doctorInput').name}
                    delay={2000}
                    handleInputChange={fetchDoctors}
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
                    handleOpen={() => {
                        if (!getValues('serviceId')) {
                            fetchServices();
                        }
                    }}
                    disabled={!getValues('officeId')}
                    isLoading={isServicesFetching}
                    inputName={register('serviceInput').name}
                    delay={2000}
                    handleInputChange={fetchServices}
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
                        (doctors?.length === 0 && !getValues('doctorId')) ||
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
