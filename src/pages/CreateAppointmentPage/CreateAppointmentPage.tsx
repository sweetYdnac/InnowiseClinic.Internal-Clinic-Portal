import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { StyledForm } from '../../components/Form';
import { Loader } from '../../components/Loader';
import { AutoComplete } from '../../components/UI/AutoComplete';
import { Datepicker } from '../../components/UI/DatePicker';
import { SubmitButton } from '../../components/UI/SubmitButton';
import { TimeSlotPicker } from '../../components/UI/TimeSlotPicker';
import { dateApiFormat, timeApiFormat, timeSlotFormat } from '../../constants/Formats';
import { endTime, startTime } from '../../constants/WorkingDay';
import { useCreateAppointmentCommand, useTimeSlotsQuery } from '../../hooks/requests/appointments';
import { usePagedDoctorsQuery } from '../../hooks/requests/doctors';
import { usePagedOfficesQuery } from '../../hooks/requests/offices';
import { usePagedPatientsQuery } from '../../hooks/requests/patients';
import { usePagedServicesQuery } from '../../hooks/requests/services';
import { usePagedSpecializationsQuery } from '../../hooks/requests/specializations';
import { useSpecializationsService } from '../../hooks/services/useSpecializationsService';
import { useCreateAppointmentValidator } from '../../hooks/validators/appointments/create';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { ISpecializationResponse } from '../../types/response/specializations';

export const CreateAppointmentPage = () => {
    const specializationsService = useSpecializationsService();
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
    } = usePagedPatientsQuery({ currentPage: 1, pageSize: 20, fullName: watch('patientInput') });

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

    const {
        data: doctors,
        isFetching: isDoctorsFetching,
        refetch: fetchDoctors,
    } = usePagedDoctorsQuery({
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
    } = usePagedServicesQuery({
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
        setValue('specializationId', '', { shouldValidate: true });
        setValue('doctorId', '', { shouldValidate: true });
        setValue('serviceId', '', { shouldValidate: true });
        setValue('date', null, { shouldValidate: true });
    }, [getValues('officeId')]);

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
                    specialization = await specializationsService.getById(id);
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
    } = useTimeSlotsQuery({
        date: watch('date')?.format(dateApiFormat) ?? '',
        doctors: watch('doctorId') ? [watch('doctorId')] : doctors?.items?.map((item) => item.id) ?? [],
        duration: services?.items.find((item) => item.id === watch('serviceId'))?.duration ?? 10,
        startTime: startTime.format(timeSlotFormat),
        endTime: endTime.format(timeSlotFormat),
    });

    const doctorsOptions = useMemo(() => {
        const selectedTime = watch('time')?.format(timeSlotFormat);
        const timeslot = timeSlots?.find((slot) => slot.time === selectedTime);
        const filteredDoctors = doctors?.items?.filter((doctor) => !timeslot || timeslot.doctors.includes(doctor.id));

        return (
            filteredDoctors?.map(
                (doctor) =>
                    ({
                        label: doctor.fullName,
                        id: doctor.id,
                    } as IAutoCompleteItem)
            ) || []
        );
    }, [doctors?.items, watch('time'), timeSlots]);

    return (
        <>
            <StyledForm onSubmit={handleSubmit(() => createAppointment())} component='form' noValidate autoComplete='on'>
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
                    options={doctorsOptions}
                    isFetching={isDoctorsFetching}
                    handleOpen={() => {
                        if (!getValues('doctorId') && !getValues('time')) {
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
                    disabled={!getValues('serviceId') || (!doctors && !getValues('doctorId')) || !getValues('officeId')}
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
            </StyledForm>

            {isCreateAppointmentLoading && <Loader />}
        </>
    );
};
