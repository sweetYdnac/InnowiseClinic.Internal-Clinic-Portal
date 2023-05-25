import { yupResolver } from '@hookform/resolvers/yup';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Box, Button, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { deepEqual } from 'fast-equals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { Datepicker } from '../../components/DatePicker/Datepicker';
import { DialogWindow } from '../../components/Dialog/DialogWindow';
import { ImageInput } from '../../components/ImageInput/ImageInput';
import { Loader } from '../../components/Loader/Loader';
import { SelectFormStatus } from '../../components/Select/SelectFormStatus';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { Textfield } from '../../components/Textfield/Textfield';
import { dateApiFormat } from '../../constants/Formats';
import { Roles } from '../../constants/Roles';
import { WorkMode } from '../../constants/WorkModes';
import { useDoctorQuery, useUpdateDoctorCommand } from '../../hooks/requests/doctors';
import { usePagedOfficesQuery } from '../../hooks/requests/offices';
import { useCreatePhotoCommand, useGetPhotoQuery, useUpdatePhotoCommand } from '../../hooks/requests/photos';
import { usePagedSpecializationsQuery } from '../../hooks/requests/specializations';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { useUpdateDoctorValidator } from '../../hooks/validators/doctors/update';
import { IProfileState, selectProfile, setProfile } from '../../store/profileSlice';
import { selectRole } from '../../store/roleSlice';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

export const DoctorProfilePage = () => {
    const [workMode, setWorkMode] = useState<WorkMode>('view');
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const { id } = useParams();
    const dispatch = useAppDispatch();

    const storeProfile = useAppSelector(selectProfile);
    const role = useAppSelector(selectRole);
    const isOwnPage = useMemo(() => role === Roles.Doctor && storeProfile.id === (id as string), [id, role, storeProfile.id]);

    const { data: doctor, isFetching: isFetchingDoctor } = useDoctorQuery(id as string, !isOwnPage);
    const profile = useMemo(
        () => (role === Roles.Doctor && storeProfile.id === (id as string) ? storeProfile : doctor),
        [id, doctor, role, storeProfile]
    );

    const { data: photoUrl, isFetching: isFetchingPhoto } = useGetPhotoQuery(profile?.photoId ?? null, !!profile?.photoId);
    const [photo, setPhoto] = useState(photoUrl as string);
    const { initialValues, validationScheme } = useUpdateDoctorValidator(profile);

    const {
        register,
        handleSubmit,
        setError,
        getValues,
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

    const {
        data: specializations,
        isFetching: isFetchingSpecializations,
        refetch: fetchSpecializations,
    } = usePagedSpecializationsQuery({
        currentPage: 1,
        pageSize: 20,
        isActive: true,
        title: watch('specializationName'),
    });

    const specializationsOptions = useMemo(
        () =>
            specializations && specializations.items.length > 0
                ? specializations?.items.map((item) => {
                      return {
                          label: item.title,
                          id: item.id,
                      } as IAutoCompleteItem;
                  }) ?? []
                : [
                      {
                          label: profile?.specializationName,
                          id: profile?.specializationId,
                      } as IAutoCompleteItem,
                  ],
        [profile?.specializationId, profile?.specializationName, specializations]
    );

    const { mutate: updateDoctor, isLoading: isUpdatingDoctor } = useUpdateDoctorCommand(id as string, watch(), setError);
    const { mutate: updatePhoto, isLoading: isUpdatingPhoto } = useUpdatePhotoCommand(watch('photoId') as string, photo as string);
    const { mutateAsync: createPhoto, isLoading: isCreatingPhoto } = useCreatePhotoCommand(photo as string);

    const sendUpdateDoctor = useCallback(
        (photoId: string) => {
            updateDoctor(photoId, {
                onSuccess: () => {
                    if (isOwnPage) {
                        dispatch(
                            setProfile({
                                ...watch(),
                                id: id,
                                dateOfBirth: dayjs(watch('dateOfBirth')).format(dateApiFormat),
                                careerStartYear: watch('careerStartYear')?.year() ?? 0,
                            } as IProfileState)
                        );
                    }
                    reset(watch());
                    setWorkMode('view');
                },
            });
        },
        [dispatch, id, isOwnPage, reset, updateDoctor, watch]
    );

    const tryUpdateDoctor = useCallback(() => {
        if (!deepEqual(watch(), defaultValues)) {
            sendUpdateDoctor(watch('photoId') as string);
        } else {
            setWorkMode('view');
        }
    }, [defaultValues, sendUpdateDoctor, watch]);

    const onSubmit = useCallback(async () => {
        if (watch('photoId') !== null) {
            if (photo !== photoUrl) {
                updatePhoto();
            }
            tryUpdateDoctor();
        } else {
            if (photo) {
                await createPhoto().then((photo) => sendUpdateDoctor(photo.id));
            } else {
                tryUpdateDoctor();
            }
        }
    }, [createPhoto, photo, photoUrl, sendUpdateDoctor, tryUpdateDoctor, updatePhoto, watch]);

    return (
        <>
            {isFetchingDoctor || isFetchingPhoto ? (
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

                        <AutoComplete
                            readonly={workMode === 'view'}
                            valueFieldName={register('specializationId').name}
                            control={control}
                            displayName='Specialization'
                            options={specializationsOptions}
                            isFetching={isFetchingSpecializations}
                            handleOpen={() => {
                                if (!getValues('specializationId')) {
                                    fetchSpecializations();
                                }
                            }}
                            handleInputChange={() => fetchSpecializations()}
                            inputFieldName={register('specializationName').name}
                            debounceDelay={2000}
                        />

                        <Datepicker
                            readonly={workMode === 'view'}
                            id={register('careerStartYear').name}
                            control={control}
                            displayName='Career start year'
                            views={['year']}
                            openTo='year'
                            disablePast={false}
                            disableFuture={true}
                        />

                        <SelectFormStatus readonly={workMode === 'view'} id={register('status').name} control={control} />

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

            {(isUpdatingDoctor || isUpdatingPhoto || isCreatingPhoto) && <Loader />}
        </>
    );
};
