import { yupResolver } from '@hookform/resolvers/yup';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, IconButton } from '@mui/material';
import { deepEqual } from 'fast-equals';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DialogWindow } from '../../components/Dialog';
import { Loader } from '../../components/Loader';
import { Datepicker } from '../../components/UI/DatePicker';
import { SubmitButton } from '../../components/UI/SubmitButton';
import { TextArea } from '../../components/UI/TextArea';
import { Textfield } from '../../components/UI/Textfield';
import { WorkMode } from '../../constants/WorkModes';
import { useGetAppointmentResultById, useUpdateAppointmentResultCommand } from '../../hooks/requests/appointmentResults';
import { useUpdateAppointmentResultValidator } from '../../hooks/validators/appointmentResults/update';
import { StyledForm, StyledOperationsButtons } from './AppointmentResultPage.styles';

export const AppointmentResultPage = () => {
    const [workMode, setWorkMode] = useState<WorkMode>('view');
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const { id } = useParams();
    const { data: result, isFetching: isFetchingResult } = useGetAppointmentResultById(id as string);
    const { initialValues, validationScheme } = useUpdateAppointmentResultValidator(result);
    const {
        register,
        handleSubmit,
        setError,
        watch,
        reset,
        formState: { errors, defaultValues },
        control,
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);

    const { mutate: updateResult, isLoading: isUpdatingResult } = useUpdateAppointmentResultCommand(id as string, watch(), setError);

    const sendUpdateAppointmentResult = useCallback(() => {
        updateResult(undefined, {
            onSuccess: () => {
                reset(watch());
                setWorkMode('view');
            },
        });
    }, [reset, updateResult, watch]);

    const onSubmit = useCallback(() => {
        if (!deepEqual(watch(), defaultValues)) {
            sendUpdateAppointmentResult();
        } else {
            setWorkMode('view');
        }
    }, [defaultValues, sendUpdateAppointmentResult, watch]);

    return (
        <>
            {isFetchingResult ? (
                <Loader />
            ) : (
                <>
                    {workMode === 'view' && (
                        <IconButton onClick={() => setWorkMode('edit')}>
                            <ModeEditIcon fontSize='medium' />
                        </IconButton>
                    )}

                    <StyledForm onSubmit={handleSubmit(() => onSubmit())} component='form' noValidate autoComplete='on'>
                        <Datepicker
                            id={register('date').name}
                            readonly={workMode === 'view'}
                            control={control}
                            displayName='Date of birth'
                        />
                        <Textfield id={register('patientFullName').name} control={control} displayName='Patient' workMode={workMode} />
                        <Datepicker
                            id={register('patientDateOfBirth').name}
                            readonly={workMode === 'view'}
                            control={control}
                            displayName={`Patient's date of birth`}
                        />
                        <Textfield id={register('doctorFullName').name} control={control} displayName='Doctor' workMode={workMode} />
                        <Textfield
                            id={register('doctorSpecializationName').name}
                            control={control}
                            displayName='Specialization'
                            workMode={workMode}
                        />
                        <Textfield id={register('serviceName').name} control={control} displayName='Service' workMode={workMode} />
                        <TextArea
                            id={register('complaints').name}
                            control={control}
                            displayName='Complaints'
                            readonly={workMode === 'view'}
                        />
                        <TextArea
                            id={register('conclusion').name}
                            control={control}
                            displayName='Conclusion'
                            readonly={workMode === 'view'}
                        />
                        <TextArea
                            id={register('recommendations').name}
                            control={control}
                            displayName='Recommendations'
                            readonly={workMode === 'view'}
                        />

                        {workMode === 'edit' && (
                            <StyledOperationsButtons>
                                <Button variant='contained' color='error' onClick={() => setIsDiscardDialogOpen(true)}>
                                    Cancel
                                </Button>
                                <SubmitButton errors={errors}>Save changes</SubmitButton>
                            </StyledOperationsButtons>
                        )}
                    </StyledForm>

                    <DialogWindow
                        isOpen={isDiscardDialogOpen}
                        title='Discard changes?'
                        content='Do you really want to cancel? Changes will not be saved.'
                        handleSubmit={() => {
                            reset();
                            setWorkMode('view');
                            setIsDiscardDialogOpen(false);
                        }}
                        handleDecline={() => setIsDiscardDialogOpen(false)}
                    />
                </>
            )}

            {isUpdatingResult && <Loader />}
        </>
    );
};
