import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { Datepicker } from '../../components/DatePicker/Datepicker';
import { Loader } from '../../components/Loader/Loader';
import { ReadonlyTextfield } from '../../components/ReadonlyTextfield/ReadonlyTextfield';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { TimeSlotPicker } from '../../components/TimeSlotPicker/TimeSlotPicker';
import { endTime, startTime } from '../../constants/WorkingDay';
import { dateApiFormat, timeViewFormat } from '../../constants/formats';
import { useAppointment, useRescheduleAppointmentCommand, useTimeSlots } from '../../hooks/appointments';
import { usePagedDoctors } from '../../hooks/doctors';
import { useRescheduleAppointmentValidator } from '../../hooks/validators/appointments/reschedule';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

export const RescheduleAppointment = () => {
    const { id } = useParams();
    const { data: appointment, isFetching: isFetchingAppointment } = useAppointment(id as string, true);
    const { initialValues, validationScheme } = useRescheduleAppointmentValidator(appointment);

    const {
        register,
        handleSubmit,
        setError,
        getValues,
        watch,
        reset,
        formState: { errors },
        control,
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);

    const {
        data: doctors,
        isFetching: isDoctorsFetching,
        refetch: fetchDoctors,
    } = usePagedDoctors({
        currentPage: 1,
        pageSize: 20,
        onlyAtWork: true,
        officeId: appointment?.officeId,
        specializationId: appointment?.specializationId,
        fullName: appointment?.doctorFullName,
    });

    const {
        data: timeSlots,
        isFetching: isTimeSlotsFetching,
        refetch: fetchTimeSlots,
    } = useTimeSlots({
        date: watch('date')?.format(dateApiFormat) ?? '',
        doctors: watch('doctorId') ? [watch('doctorId')] : doctors?.items?.map((item) => item.id) ?? [],
        duration: appointment?.duration ?? 10,
        startTime: startTime.format(timeViewFormat),
        endTime: endTime.format(timeViewFormat),
    });

    const { mutate: rescheduleAppointment, isLoading: isRescheduleAppointmentLoading } = useRescheduleAppointmentCommand(
        id as string,
        getValues(),
        setError
    );

    const doctorsOptions = useMemo(() => {
        if (getValues('doctorId') && getValues('doctorInput') && !doctors) {
            return [
                {
                    label: getValues('doctorInput'),
                    id: getValues('doctorId'),
                },
            ];
        }

        const selectedTime = getValues('time')?.format(timeViewFormat);
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
    }, [doctors, getValues('doctorId'), getValues('doctorInput'), timeSlots]);

    return (
        <>
            <Box
                onSubmit={handleSubmit(() => rescheduleAppointment())}
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
                    Reschedule Appointment
                </Typography>

                <ReadonlyTextfield displayName='Patient' value={appointment?.patientFullName as string} />
                <ReadonlyTextfield displayName='Office' value={appointment?.officeAddress as string} />
                <ReadonlyTextfield displayName='Specialization' value={appointment?.doctorSpecializationName as string} />
                <ReadonlyTextfield displayName='Service' value={appointment?.serviceName as string} />

                <AutoComplete
                    valueFieldName={register('doctorId').name}
                    control={control}
                    displayName='Doctor'
                    options={doctorsOptions ?? []}
                    isFetching={isDoctorsFetching}
                    handleOpen={() => {
                        if (!getValues('doctorId')) {
                            fetchDoctors();
                        }
                    }}
                    handleInputChange={() => fetchDoctors()}
                    inputFieldName={register('doctorInput').name}
                    debounceDelay={2000}
                />

                <Datepicker disabled={!doctors && !getValues('doctorId')} id={register('date').name} control={control} displayName='Date' />

                <TimeSlotPicker
                    id={register('time').name}
                    control={control}
                    displayName='Time slot'
                    timeSlots={timeSlots ?? []}
                    handleOpen={() => fetchTimeSlots()}
                    disabled={
                        (doctors?.items?.length === 0 && !getValues('doctorId')) || !getValues('date')?.isValid() || isTimeSlotsFetching
                    }
                    isLoading={isTimeSlotsFetching}
                />

                <SubmitButton errors={errors}>Reschedule</SubmitButton>
            </Box>

            {(isFetchingAppointment || isRescheduleAppointmentLoading) && <Loader />}
        </>
    );
};
