import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageInput } from '../../components/ImageInput/ImageInput';
import { Loader } from '../../components/Loader/Loader';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { ToggleSwitch } from '../../components/Switch/ToggleSwitch';
import { Textfield } from '../../components/Textfield/Textfield';
import { useCreateOfficeCommand } from '../../hooks/requests/offices';
import { useCreatePhotoCommand } from '../../hooks/requests/photos';
import { useCreateOfficeValidator } from '../../hooks/validators/offices/create';

export const CreateOfficePage = () => {
    const [photoUrl, setPhotoUrl] = useState('');
    const { initialValues, validationScheme } = useCreateOfficeValidator();
    const {
        register,
        control,
        watch,
        setError,
        handleSubmit,
        setValue,
        formState: { errors, touchedFields },
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { mutateAsync: createPhoto, isLoading: isCreatePhotoLoading } = useCreatePhotoCommand(photoUrl);
    const { mutateAsync: createOffice, isLoading: isCreateOfficeLoading } = useCreateOfficeCommand(watch(), setError);

    const onSubmit = useCallback(async () => {
        if (photoUrl) {
            await createPhoto().then(async (photo) => await createOffice({ photoId: photo.id }));
        } else {
            await createOffice({ photoId: null });
        }
    }, [createOffice, createPhoto, photoUrl]);

    return (
        <>
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
                <ImageInput imageUrl={photoUrl} setImageUrl={setPhotoUrl} />

                <Textfield id={register('city').name} control={control} displayName='City' workMode='edit' disableWhiteSpace={true} />
                <Textfield id={register('street').name} control={control} displayName='Street' workMode='edit' disableWhiteSpace={true} />
                <Textfield
                    id={register('houseNumber').name}
                    control={control}
                    displayName='House number'
                    workMode='edit'
                    disableWhiteSpace={true}
                />
                <Textfield
                    id={register('officeNumber').name}
                    control={control}
                    displayName='Office number'
                    workMode='edit'
                    disableWhiteSpace={true}
                />
                <Textfield
                    id={register('registryPhoneNumber').name}
                    control={control}
                    displayName='City'
                    workMode='edit'
                    inputMode='numeric'
                />
                <ToggleSwitch
                    value={watch('isActive')}
                    handleChange={(value) => setValue('isActive', value, { shouldTouch: true, shouldValidate: true })}
                />

                <SubmitButton
                    errors={errors}
                    shouldBeTouched={[
                        touchedFields.city,
                        touchedFields.street,
                        touchedFields.houseNumber,
                        touchedFields.officeNumber,
                        touchedFields.registryPhoneNumber,
                    ]}
                >
                    Create
                </SubmitButton>
            </Box>

            {(isCreateOfficeLoading || isCreatePhotoLoading) && <Loader />}
        </>
    );
};
