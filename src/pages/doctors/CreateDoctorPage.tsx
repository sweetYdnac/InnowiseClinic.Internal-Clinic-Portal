import { yupResolver } from '@hookform/resolvers/yup';
import { AccountCircle } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { Datepicker } from '../../components/DatePicker/Datepicker';
import { ImageInput } from '../../components/ImageInput/ImageInput';
import { Loader } from '../../components/Loader/Loader';
import { SelectFormStatus } from '../../components/Select/SelectFormStatus';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { Textfield } from '../../components/Textfield/Textfield';
import { useSignUpCommand } from '../../hooks/authorization';
import { useCreateDoctorCommand } from '../../hooks/doctors';
import { usePagedOfficesQuery } from '../../hooks/offices';
import { useCreatePhotoCommand } from '../../hooks/photos';
import { usePagedSpecializationsQuery } from '../../hooks/specializations';
import { useCreateDoctorValidator } from '../../hooks/validators/doctors/create';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

export const CreateDoctorPage = () => {
    const [photoUrl, setPhotoUrl] = useState('');
    const { initialValues, validationScheme } = useCreateDoctorValidator();
    const {
        register,
        control,
        watch,
        getValues,
        setError,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const {
        data: specializations,
        isFetching: isSpecializationsFetching,
        refetch: fetchSpecializations,
    } = usePagedSpecializationsQuery({
        currentPage: 1,
        pageSize: 20,
        isActive: true,
        title: watch('specializationInput'),
    });

    const {
        data: offices,
        isFetching: isOfficesFetching,
        refetch: fetchOffices,
    } = usePagedOfficesQuery({ currentPage: 1, pageSize: 50, isActive: true });

    const { mutateAsync: createAccount, isLoading: isCreateAccountLoading } = useSignUpCommand(watch('email'));
    const { mutateAsync: createPhoto, isLoading: isCreatePhotoLoading } = useCreatePhotoCommand(photoUrl);
    const { mutateAsync: createDoctor, isLoading: isCreateDoctorLoading } = useCreateDoctorCommand(getValues(), setError);

    const createProfile = useCallback(async () => {
        await createAccount().then(async (account) => {
            if (photoUrl) {
                await createPhoto().then(async (photo) => await createDoctor({ accountId: account?.id as string, photoId: photo.id }));
            } else {
                await createDoctor({ accountId: account?.id as string, photoId: null });
            }
        });
    }, [createAccount, createDoctor, createPhoto, photoUrl]);

    return (
        <>
            <Box
                onSubmit={handleSubmit(() => createProfile())}
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
                    Create Doctor
                </Typography>

                <ImageInput imageUrl={photoUrl} setImageUrl={setPhotoUrl} />

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
                    id={register('email').name}
                    control={control}
                    inputMode='email'
                    displayName='Email'
                    placeholder='example@gmail.com'
                    workMode='edit'
                    startAdornment={<AccountCircle />}
                />

                <AutoComplete
                    valueFieldName={register('officeId').name}
                    control={control}
                    displayName='Office'
                    options={
                        offices?.items?.map((item) => {
                            return {
                                label: item.address,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    isFetching={isOfficesFetching}
                    handleOpen={() => {
                        if (!getValues('officeId')) {
                            fetchOffices();
                        }
                    }}
                    handleInputChange={() => fetchOffices()}
                    inputFieldName={register('officeInput').name}
                    debounceDelay={2000}
                />

                <AutoComplete
                    valueFieldName={register('specializationId').name}
                    control={control}
                    displayName='Specialization'
                    options={
                        specializations?.items.map((item) => {
                            return {
                                label: item.title,
                                id: item.id,
                            } as IAutoCompleteItem;
                        }) ?? []
                    }
                    isFetching={isSpecializationsFetching}
                    handleOpen={() => {
                        if (!getValues('specializationId')) {
                            fetchSpecializations();
                        }
                    }}
                    handleInputChange={() => fetchSpecializations()}
                    inputFieldName={register('specializationInput').name}
                    debounceDelay={2000}
                />

                <Datepicker
                    id={register('careerStartYear').name}
                    control={control}
                    displayName='Career start year'
                    views={['year']}
                    openTo='year'
                    disablePast={false}
                    disableFuture={true}
                />

                <SelectFormStatus id={register('status').name} control={control} />

                <SubmitButton
                    errors={errors}
                    shouldBeTouched={[
                        touchedFields.firstName,
                        touchedFields.lastName,
                        touchedFields.middleName,
                        touchedFields.dateOfBirth as boolean,
                        touchedFields.email,
                        touchedFields.officeId,
                        touchedFields.specializationId,
                        touchedFields.careerStartYear as boolean,
                        touchedFields.status,
                    ]}
                >
                    Create
                </SubmitButton>
            </Box>

            {(isCreateAccountLoading || isCreatePhotoLoading || isCreateDoctorLoading) && <Loader />}
        </>
    );
};
