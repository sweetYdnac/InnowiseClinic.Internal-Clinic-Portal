import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { Datepicker } from '../../components/UI/DatePicker';
import { SubmitButton } from '../../components/UI/SubmitButton';
import { TextArea } from '../../components/UI/TextArea';
import { Textfield } from '../../components/UI/Textfield';
import { useCreateAppointmentResultCommand } from '../../hooks/requests/appointmentResults';
import { useCreateAppointmentResultValidator } from '../../hooks/validators/appointmentResults/create';
import { ICreateAppointmentResultDTO } from '../../types/dto/appointmentResults';

export const CreateAppointmentResultPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const dto = location.state as ICreateAppointmentResultDTO;
    const { initialValues, formValidationScheme } = useCreateAppointmentResultValidator(dto, id as string);
    const {
        register,
        control,
        watch,
        setError,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(formValidationScheme),
        defaultValues: initialValues,
    });

    const { mutate, isLoading } = useCreateAppointmentResultCommand(watch(), setError);

    return (
        <>
            <Box
                onSubmit={handleSubmit(() => mutate())}
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
                    Create Appointment Result
                </Typography>

                <Datepicker id={register('date').name} readonly={true} control={control} displayName='Date of birth' />
                <Textfield id={register('patientFullName').name} control={control} displayName='Patient' />
                <Datepicker
                    id={register('patientDateOfBirth').name}
                    readonly={true}
                    control={control}
                    displayName={`Patient's date of birth`}
                />
                <Textfield id={register('doctorFullName').name} control={control} displayName='Doctor' />
                <Textfield id={register('doctorSpecializationName').name} control={control} displayName='Specialization' />
                <Textfield id={register('serviceName').name} control={control} displayName='Service' />

                <TextArea id={register('complaints').name} control={control} displayName='Complaints' />
                <TextArea id={register('conclusion').name} control={control} displayName='Conclusion' />
                <TextArea id={register('recommendations').name} control={control} displayName='Recommendations' />

                <SubmitButton
                    errors={errors}
                    shouldBeTouched={[touchedFields.complaints, touchedFields.conclusion, touchedFields.recommendations]}
                >
                    Create
                </SubmitButton>
            </Box>

            {isLoading && <Loader />}
        </>
    );
};
