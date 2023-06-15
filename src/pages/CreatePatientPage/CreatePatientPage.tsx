import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Loader } from '../../components/Loader';
import { Datepicker } from '../../components/UI/DatePicker';
import { SubmitButton } from '../../components/UI/SubmitButton';
import { Textfield } from '../../components/UI/Textfield';
import { useCreatePatientCommand } from '../../hooks/requests/patients';
import { usePatientValidator } from '../../hooks/validators/patients/create&update';

export const CreatePatientPage = () => {
    const { initialValues, formValidationScheme } = usePatientValidator();
    const {
        register,
        control,
        watch,
        setError,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(formValidationScheme),
        defaultValues: initialValues,
    });

    const { mutate: createPatient, isLoading: isCreatingPatient } = useCreatePatientCommand(watch(), setError);

    return (
        <>
            <Box
                onSubmit={handleSubmit(() => createPatient())}
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
                    id={register('phoneNumber').name}
                    control={control}
                    displayName='Phone number'
                    workMode='edit'
                    inputMode='numeric'
                    startAdornment={<>+</>}
                />

                <SubmitButton
                    errors={errors}
                    shouldBeTouched={[
                        touchedFields.firstName,
                        touchedFields.lastName,
                        touchedFields.middleName,
                        touchedFields.dateOfBirth as boolean,
                        touchedFields.phoneNumber,
                    ]}
                >
                    Create
                </SubmitButton>
            </Box>

            {isCreatingPatient && <Loader />}
        </>
    );
};
