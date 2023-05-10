import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SpecializationsService from '../../api/services/SpecializationsService';
import AutoComplete from '../../components/AutoComplete/AutoComplete';
import Datepicker from '../../components/DatePicker/Datepicker';
import Loader from '../../components/Loader/Loader';
import TimeSlotPicker from '../../components/TimeSlotPicker/TimeSlotPicker';
import { endTime, startTime } from '../../constants/WorkingDay';
import { dateApiFormat, timeViewFormat } from '../../constants/formats';
import { useTimeSlots } from '../../hooks/appointments';
import { usePagedDoctors } from '../../hooks/doctors';
import { usePagedOffices } from '../../hooks/offices';
import { usePagedServices } from '../../hooks/services';
import { usePagedSpecializations } from '../../hooks/specializations';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { ISpecializationResponse } from '../../types/response/specializations';
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

    const { data: offices, isFetching: isOfficesFetching, refetch: fetchOffices } = usePagedOffices({ currentPage: 1, pageSize: 50 });

    const {
        data: specializations,
        isFetching: isSpecializationsFetching,
        refetch: fetchSpecializations,
    } = usePagedSpecializations(
        { currentPage: 1, pageSize: 2 },
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
        { currentPage: 1, pageSize: 2 },
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
        { currentPage: 1, pageSize: 2 },
        {
            isActive: true,
            title: watch('serviceInput'),
            specializationId: watch('specializationId'),
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
    }, [watch('date')]);

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
                autoComplete='on'
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
                    handleOpen={() => {
                        if (!getValues('specializationId')) {
                            fetchSpecializations();
                        }
                    }}
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
                    handleOpen={() => {
                        if (!getValues('serviceId')) {
                            fetchServices();
                        }
                    }}
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

                <TimeSlotPicker
                    id={register('time').name}
                    control={control}
                    displayName='Time slot'
                    timeSlots={timeSlots ?? []}
                    handleOpen={() => fetchTimeSlots()}
                    readOnly={
                        (doctors?.length === 0 && !getValues('doctorId')) ||
                        !getValues('serviceId') ||
                        !getValues('date')?.isValid() ||
                        isTimeSlotsFetching
                    }
                    disabled={
                        (doctors?.length === 0 && !getValues('doctorId')) ||
                        !getValues('serviceId') ||
                        !getValues('date')?.isValid() ||
                        isTimeSlotsFetching
                    }
                />

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

            {isTimeSlotsFetching && <Loader />}
        </>
    );
};

export default CreateAppointment;
