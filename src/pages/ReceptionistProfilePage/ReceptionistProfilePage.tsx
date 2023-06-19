import { yupResolver } from '@hookform/resolvers/yup';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, IconButton } from '@mui/material';
import { deepEqual } from 'fast-equals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DialogWindow } from '../../components/Dialog';
import { StyledForm, StyledOperationsButtons } from '../../components/Form';
import { Loader } from '../../components/Loader';
import { AutoComplete } from '../../components/UI/AutoComplete';
import { ImageInput } from '../../components/UI/ImageInput';
import { SelectFormStatus } from '../../components/UI/SelectFormStatus';
import { SubmitButton } from '../../components/UI/SubmitButton';
import { Textfield } from '../../components/UI/Textfield';
import { Roles } from '../../constants/Roles';
import { WorkMode } from '../../constants/WorkModes';
import { usePagedOfficesQuery } from '../../hooks/requests/offices';
import { useCreatePhotoCommand, useGetPhotoQuery, useUpdatePhotoCommand } from '../../hooks/requests/photos';
import { useGetReceptionistByIdQuery, useUpdateReceptionistCommand } from '../../hooks/requests/receptionists';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { useReceptionistValidator } from '../../hooks/validators/receptionists/update';
import { IProfileState, selectProfile, setProfile } from '../../store/profileSlice';
import { selectRole } from '../../store/roleSlice';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

export const ReceptionistProfilePage = () => {
    const [workMode, setWorkMode] = useState<WorkMode>('view');
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const { id } = useParams();
    const dispatch = useAppDispatch();

    const storeProfile = useAppSelector(selectProfile);
    const role = useAppSelector(selectRole);
    const isOwnPage = useMemo(() => role === Roles.Receptionist && storeProfile.id === (id as string), [id, role, storeProfile.id]);

    const { data: receptionist, isFetching: isFetchingReceptionist } = useGetReceptionistByIdQuery(id as string, !isOwnPage);
    const profile = useMemo(
        () => (role === Roles.Receptionist && storeProfile.id === (id as string) ? storeProfile : receptionist),
        [id, receptionist, role, storeProfile]
    );

    const { data: photoUrl, isFetching: isFetchingPhoto } = useGetPhotoQuery(profile?.photoId ?? null, !!profile?.photoId);
    const [photo, setPhoto] = useState(photoUrl as string);
    const { initialValues, validationScheme } = useReceptionistValidator(profile);

    const {
        register,
        handleSubmit,
        setError,
        watch,
        reset,
        getValues,
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

    const {
        data: offices,
        isFetching: isFetchingOffices,
        refetch: fetchOffices,
    } = usePagedOfficesQuery({ currentPage: 1, pageSize: 50, isActive: true });

    const officesOptions = useMemo(() => {
        return offices && offices.items.length > 0
            ? offices?.items?.map((item) => {
                  return {
                      label: item.address,
                      id: item.id,
                  } as IAutoCompleteItem;
              }) ?? []
            : [
                  {
                      label: profile?.officeAddress,
                      id: profile?.officeId,
                  } as IAutoCompleteItem,
              ];
    }, [offices, profile?.officeAddress, profile?.officeId]);

    const { mutate: updateReceptionist, isLoading: isUpdatingReceptionist } = useUpdateReceptionistCommand(id as string, watch(), setError);
    const { mutate: updatePhoto, isLoading: isUpdatingPhoto } = useUpdatePhotoCommand(watch('photoId') as string, photo as string);
    const { mutateAsync: createPhoto, isLoading: isCreatingPhoto } = useCreatePhotoCommand(photo as string);

    const sendUpdateReceptionist = useCallback(
        (photoId: string) => {
            updateReceptionist(
                { photoId },
                {
                    onSuccess: () => {
                        if (isOwnPage) {
                            dispatch(
                                setProfile({
                                    ...watch(),
                                    id: id,
                                } as IProfileState)
                            );
                        }
                        reset(watch());
                        setWorkMode('view');
                    },
                }
            );
        },
        [dispatch, id, isOwnPage, reset, updateReceptionist, watch]
    );

    const tryUpdateReceptionist = useCallback(() => {
        if (!deepEqual(watch(), defaultValues)) {
            sendUpdateReceptionist(watch('photoId') as string);
        } else {
            setWorkMode('view');
        }
    }, [defaultValues, sendUpdateReceptionist, watch]);

    const onSubmit = useCallback(async () => {
        if (watch('photoId') !== null) {
            if (photo !== photoUrl) {
                updatePhoto();
            }
            tryUpdateReceptionist();
        } else {
            if (photo) {
                await createPhoto().then((photo) => sendUpdateReceptionist(photo.id));
            } else {
                tryUpdateReceptionist();
            }
        }
    }, [createPhoto, photo, photoUrl, sendUpdateReceptionist, tryUpdateReceptionist, updatePhoto, watch]);

    return (
        <>
            {isFetchingReceptionist || isFetchingPhoto ? (
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

                        <Textfield id={register('firstName').name} control={control} displayName='First name' workMode={workMode} />
                        <Textfield id={register('lastName').name} control={control} displayName='Last name' workMode={workMode} />
                        <Textfield id={register('middleName').name} control={control} displayName='Middle name' workMode={workMode} />

                        <AutoComplete
                            readonly={workMode === 'view'}
                            valueFieldName={register('officeId').name}
                            control={control}
                            displayName='Office'
                            options={officesOptions}
                            isFetching={isFetchingOffices}
                            handleOpen={() => {
                                if (!getValues('officeId')) {
                                    fetchOffices();
                                }
                            }}
                            handleInputChange={() => fetchOffices()}
                            inputFieldName={register('officeAddress').name}
                            debounceDelay={2000}
                        />

                        <SelectFormStatus readonly={workMode === 'view'} id={register('status').name} control={control} />

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

            {(isUpdatingReceptionist || isUpdatingPhoto || isCreatingPhoto) && <Loader />}
        </>
    );
};
