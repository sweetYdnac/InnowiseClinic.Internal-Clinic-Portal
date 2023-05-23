import { yupResolver } from '@hookform/resolvers/yup';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Box, Button, IconButton } from '@mui/material';
import { deepEqual } from 'fast-equals';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Datepicker } from '../../../components/DatePicker/Datepicker';
import { DialogWindow } from '../../../components/Dialog/DialogWindow';
import { ImageInput } from '../../../components/ImageInput/ImageInput';
import { Loader } from '../../../components/Loader/Loader';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton';
import { Textfield } from '../../../components/Textfield/Textfield';
import { WorkMode } from '../../../constants/WorkModes';
import { useGetPatientByIdQuery, useUpdatePatientCommand } from '../../../hooks/requests/patients';
import { useCreatePhotoCommand, useGetPhotoQuery, useUpdatePhotoCommand } from '../../../hooks/requests/photos';
import { usePatientValidator } from '../../../hooks/validators/patients/create&update';

export const PatientInformation = () => {
    const [workMode, setWorkMode] = useState<WorkMode>('view');
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const { id: patientId } = useParams();
    const { data: patient, isFetching: isFetchingPatient } = useGetPatientByIdQuery(patientId as string, true);
    const { data: photoUrl, isFetching: isFetchingPhoto } = useGetPhotoQuery(patient?.photoId ?? null, !!patient?.photoId);
    const [photo, setPhoto] = useState(photoUrl as string);
    const { initialValues, formValidationScheme } = usePatientValidator(patient);

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
        resolver: yupResolver(formValidationScheme),
        defaultValues: initialValues,
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);

    useEffect(() => {
        setPhoto(photoUrl as string);
    }, [photoUrl]);

    const { mutate: updatePatient, isLoading: isUpdatingPatient } = useUpdatePatientCommand(patientId as string, watch(), setError);
    const { mutate: updatePhoto, isLoading: isUpdatingPhoto } = useUpdatePhotoCommand(watch('photoId') as string, photo as string);
    const { mutateAsync: createPhoto, isLoading: isCreatingPhoto } = useCreatePhotoCommand(photo as string);

    const sendUpdatePatient = useCallback(
        (photoId: string) => {
            updatePatient(
                { photoId },
                {
                    onSuccess: () => {
                        reset(watch());
                        setWorkMode('view');
                    },
                }
            );
        },
        [reset, updatePatient, watch]
    );

    const tryUpdatePatient = useCallback(() => {
        if (!deepEqual(watch(), defaultValues)) {
            sendUpdatePatient(watch('photoId') as string);
        } else {
            setWorkMode('view');
        }
    }, [defaultValues, sendUpdatePatient, watch]);

    const onSubmit = useCallback(async () => {
        if (watch('photoId') !== null) {
            if (photo !== photoUrl) {
                updatePhoto();
            }
            tryUpdatePatient();
        } else {
            if (photo) {
                await createPhoto().then((photo) => sendUpdatePatient(photo.id));
            } else {
                tryUpdatePatient();
            }
        }
    }, [createPhoto, photo, photoUrl, sendUpdatePatient, tryUpdatePatient, updatePhoto, watch]);

    return (
        <>
            {isFetchingPatient || isFetchingPhoto ? (
                <Loader />
            ) : (
                <>
                    {workMode === 'view' && (
                        <IconButton onClick={() => setWorkMode('edit')}>
                            <ModeEditIcon fontSize='medium' />
                        </IconButton>
                    )}

                    <Box
                        onSubmit={handleSubmit(() => onSubmit())}
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
                        <ImageInput imageUrl={photo} setImageUrl={setPhoto} workMode={workMode} />

                        <Textfield id={register('firstName').name} control={control} displayName='First name' workMode={workMode} />
                        <Textfield id={register('lastName').name} control={control} displayName='Last name' workMode={workMode} />
                        <Textfield id={register('middleName').name} control={control} displayName='Middle name' workMode={workMode} />

                        <Datepicker
                            readonly={workMode === 'view'}
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
                            workMode={workMode}
                            inputMode='numeric'
                        />

                        {workMode === 'edit' && (
                            <div
                                style={{
                                    width: '75%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <Button variant='contained' color='error' onClick={() => setIsDiscardDialogOpen(true)}>
                                    Cancel
                                </Button>
                                <SubmitButton errors={errors}>Save changes</SubmitButton>
                            </div>
                        )}
                    </Box>

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

            {(isUpdatingPatient || isUpdatingPhoto || isCreatingPhoto) && <Loader />}
        </>
    );
};
