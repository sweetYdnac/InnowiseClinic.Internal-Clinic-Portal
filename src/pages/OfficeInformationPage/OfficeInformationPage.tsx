import { yupResolver } from '@hookform/resolvers/yup';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, IconButton } from '@mui/material';
import { deepEqual } from 'fast-equals';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DialogWindow } from '../../components/Dialog';
import { StyledForm, StyledOperationsButtons } from '../../components/Form';
import { Loader } from '../../components/Loader';
import { ImageInput } from '../../components/UI/ImageInput';
import { SubmitButton } from '../../components/UI/SubmitButton';
import { Textfield } from '../../components/UI/Textfield';
import { ToggleSwitch } from '../../components/UI/ToggleSwitch';
import { WorkMode } from '../../constants/WorkModes';
import { useOfficeQuery, useUpdateOfficeCommand } from '../../hooks/requests/offices';
import { useCreatePhotoCommand, useGetPhotoQuery, useUpdatePhotoCommand } from '../../hooks/requests/photos';
import { useUpdateOfficeValidator } from '../../hooks/validators/offices/update';

export const OfficeInformationPage = () => {
    const [workMode, setWorkMode] = useState<WorkMode>('view');
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const { id } = useParams();
    const { data: office, isFetching: isFetchingOffice } = useOfficeQuery(id as string);
    const { data: photoUrl, isFetching: isFetchingPhoto } = useGetPhotoQuery(office?.photoId ?? null, !!office?.photoId);
    const [photo, setPhoto] = useState(photoUrl as string);
    const { initialValues, validationScheme } = useUpdateOfficeValidator(office);

    const {
        register,
        handleSubmit,
        setError,
        watch,
        reset,
        setValue,
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

    useEffect(() => {
        setPhoto(photoUrl as string);
    }, [photoUrl]);

    const { mutate: updateOffice, isLoading: isUpdatingOffice } = useUpdateOfficeCommand(id as string, watch(), setError);
    const { mutate: updatePhoto, isLoading: isUpdatingPhoto } = useUpdatePhotoCommand(watch('photoId') as string, photo as string);
    const { mutateAsync: createPhoto, isLoading: isCreatingPhoto } = useCreatePhotoCommand(photo as string);

    const sendUpdateOffice = useCallback(
        (photoId: string) => {
            updateOffice(photoId, {
                onSuccess: () => {
                    reset(watch());
                    setWorkMode('view');
                },
            });
        },
        [reset, updateOffice, watch]
    );

    const tryUpdateOffice = useCallback(() => {
        if (!deepEqual(watch(), defaultValues)) {
            sendUpdateOffice(watch('photoId') as string);
        } else {
            setWorkMode('view');
        }
    }, [defaultValues, sendUpdateOffice, watch]);

    const onSubmit = useCallback(async () => {
        if (watch('photoId') !== null) {
            if (photo !== photoUrl) {
                updatePhoto();
            }
            tryUpdateOffice();
        } else {
            if (photo) {
                await createPhoto().then((photo) => sendUpdateOffice(photo.id));
            } else {
                tryUpdateOffice();
            }
        }
    }, [createPhoto, photo, photoUrl, sendUpdateOffice, tryUpdateOffice, updatePhoto, watch]);

    return (
        <>
            {isFetchingOffice || isFetchingPhoto ? (
                <Loader />
            ) : (
                <>
                    {workMode === 'view' && (
                        <IconButton onClick={() => setWorkMode('edit')}>
                            <ModeEditIcon fontSize='medium' />
                        </IconButton>
                    )}

                    <StyledForm onSubmit={handleSubmit(() => onSubmit())} component='form' noValidate autoComplete='on'>
                        <ImageInput imageUrl={photo} setImageUrl={setPhoto} workMode={workMode} />

                        <Textfield
                            id={register('city').name}
                            control={control}
                            displayName='City'
                            workMode={workMode}
                            disableWhiteSpace={true}
                        />
                        <Textfield
                            id={register('street').name}
                            control={control}
                            displayName='Street'
                            workMode={workMode}
                            disableWhiteSpace={true}
                        />
                        <Textfield
                            id={register('houseNumber').name}
                            control={control}
                            displayName='House number'
                            workMode={workMode}
                            disableWhiteSpace={true}
                        />
                        <Textfield
                            id={register('officeNumber').name}
                            control={control}
                            displayName='Office number'
                            workMode={workMode}
                            disableWhiteSpace={true}
                        />
                        <Textfield
                            id={register('registryPhoneNumber').name}
                            control={control}
                            displayName='Phone number'
                            workMode={workMode}
                            inputMode='numeric'
                            startAdornment={<>+</>}
                        />
                        <ToggleSwitch
                            disabled={workMode === 'view'}
                            value={watch('isActive')}
                            handleChange={(value) => setValue('isActive', value, { shouldTouch: true, shouldValidate: true })}
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

            {(isUpdatingOffice || isUpdatingPhoto || isCreatingPhoto) && <Loader />}
        </>
    );
};
