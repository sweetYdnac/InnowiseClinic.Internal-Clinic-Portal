import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { StyledForm } from '../../components/Form';
import { Loader } from '../../components/Loader';
import { AutoComplete } from '../../components/UI/AutoComplete';
import { Datepicker } from '../../components/UI/DatePicker';
import { ReadonlyTextfield } from '../../components/UI/ReadonlyTextfield';
import { SubmitButton } from '../../components/UI/SubmitButton';
import { TimeSlotPicker } from '../../components/UI/TimeSlotPicker';
import { dateApiFormat, timeSlotFormat } from '../../constants/Formats';
import { endTime, startTime } from '../../constants/WorkingDay';
import { useAppointmentQuery, useRescheduleAppointmentCommand, useTimeSlotsQuery } from '../../hooks/requests/appointments';
import { usePagedDoctorsQuery } from '../../hooks/requests/doctors';
import { useRescheduleAppointmentValidator } from '../../hooks/validators/appointments/reschedule';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

export const RescheduleAppointmentPage = () => {
    const { id } = useParams();
    const { data: appointment, isFetching: isFetchingAppointment } = useAppointmentQuery(id as string, true);
    const { initialValues, validationScheme } = useRescheduleAppointmentValidator(appointment);

    const {
        register,
        handleSubmit,
        setError,
        getValues,
        watch,
        reset,
        setValue,
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
    } = usePagedDoctorsQuery({
        currentPage: 1,
        pageSize: 20,
        onlyAtWork: true,
        officeId: appointment?.officeId,
        specializationId: appointment?.specializationId,
        fullName: watch('doctorInput'),
    });

    const {
        data: timeSlots,
        isFetching: isTimeSlotsFetching,
        refetch: fetchTimeSlots,
    } = useTimeSlotsQuery({
        date: watch('date')?.format(dateApiFormat) ?? '',
        doctors: watch('doctorId') ? [watch('doctorId')] : doctors?.items?.map((item) => item.id) ?? [],
        duration: appointment?.duration ?? 10,
        startTime: startTime.format(timeSlotFormat),
        endTime: endTime.format(timeSlotFormat),
    });

    const { mutate: rescheduleAppointment, isLoading: isRescheduleAppointmentLoading } = useRescheduleAppointmentCommand(
        id as string,
        watch(),
        initialValues.date,
        setError
    );

    const handleDateChange = useCallback(() => {
        setValue('time', null, { shouldValidate: true, shouldTouch: true });
    }, [setValue]);

    const doctorsOptions = useMemo(() => {
        if (getValues('doctorId') && getValues('doctorInput') && !doctors) {
            return [
                {
                    label: getValues('doctorInput'),
                    id: getValues('doctorId'),
                },
            ];
        }

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
    }, [doctors?.items, getValues('doctorId'), getValues('doctorInput'), timeSlots, watch('time')]);

    return (
        <>
            <StyledForm onSubmit={handleSubmit(() => rescheduleAppointment())} component='form' noValidate autoComplete='on'>
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
                    options={doctorsOptions}
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

                <Datepicker
                    disabled={!doctors && !getValues('doctorId')}
                    id={register('date').name}
                    control={control}
                    displayName='Date'
                    handleValueChange={handleDateChange}
                />

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
            </StyledForm>

            {(isFetchingAppointment || isRescheduleAppointmentLoading) && <Loader />}
        </>
    );
};
