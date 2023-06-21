import { yupResolver } from '@hookform/resolvers/yup';
import { AccountCircle } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyledForm } from '../../components/Form';
import { Loader } from '../../components/Loader';
import { AutoComplete } from '../../components/UI/AutoComplete';
import { ImageInput } from '../../components/UI/ImageInput';
import { SelectFormStatus } from '../../components/UI/Selects/SelectFormStatus';
import { SubmitButton } from '../../components/UI/SubmitButton';
import { Textfield } from '../../components/UI/Textfield';
import { Roles } from '../../constants/Roles';
import { useSignUpCommand } from '../../hooks/requests/authorization';
import { usePagedOfficesQuery } from '../../hooks/requests/offices';
import { useCreatePhotoCommand } from '../../hooks/requests/photos';
import { useCreateReceptionistCommand } from '../../hooks/requests/receptionists';
import { useCreateReceptionistValidator } from '../../hooks/validators/receptionists/create';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { generatePassword } from '../../utils/functions';

export const CreateReceptionistPage = () => {
    const [photoUrl, setPhotoUrl] = useState('');
    const { initialValues, formValidationScheme } = useCreateReceptionistValidator();
    const {
        register,
        control,
        watch,
        setError,
        handleSubmit,
        getValues,
        formState: { errors, touchedFields },
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(formValidationScheme),
        defaultValues: initialValues,
    });

    const {
        data: offices,
        isFetching: isFetchingOffices,
        refetch: fetchOffices,
    } = usePagedOfficesQuery({ currentPage: 1, pageSize: 50, isActive: null });

    const officesOptions = useMemo(
        () =>
            offices?.items?.map((item) => {
                return {
                    label: item.address,
                    id: item.id,
                } as IAutoCompleteItem;
            }) ?? [],
        [offices]
    );

    const { mutateAsync: createAccount, isLoading: isCreatingAccount } = useSignUpCommand(watch('email'), Roles.Receptionist);
    const { mutateAsync: createPhoto, isLoading: isCreatingPhoto } = useCreatePhotoCommand(photoUrl);
    const { mutate: CreateReceptionist, isLoading: isCreatingReceptionist } = useCreateReceptionistCommand(watch(), setError);

    const onSubmit = useCallback(async () => {
        const password = generatePassword();

        await createAccount({ password: password }).then(async (account) => {
            if (photoUrl) {
                await createPhoto().then(async (photo) =>
                    CreateReceptionist({ accountId: account?.id as string, photoId: photo.id, password: password })
                );
            } else {
                CreateReceptionist({ accountId: account?.id as string, photoId: null, password: password });
            }
        });
    }, [CreateReceptionist, createAccount, createPhoto, photoUrl]);

    return (
        <>
            <StyledForm onSubmit={handleSubmit(() => onSubmit())} component='form' noValidate autoComplete='on'>
                <Typography variant='h5' gutterBottom>
                    Create Receptionist
                </Typography>

                <ImageInput imageUrl={photoUrl} setImageUrl={setPhotoUrl} workMode='edit' />

                <Textfield id={register('firstName').name} control={control} displayName='First name' workMode='edit' />
                <Textfield id={register('lastName').name} control={control} displayName='Last name' workMode='edit' />
                <Textfield id={register('middleName').name} control={control} displayName='Middle name' workMode='edit' />

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

                <SelectFormStatus id={register('status').name} control={control} />

                <SubmitButton
                    errors={errors}
                    shouldBeTouched={[touchedFields.firstName, touchedFields.lastName, touchedFields.email, touchedFields.officeId]}
                >
                    Create
                </SubmitButton>
            </StyledForm>

            {(isCreatingAccount || isCreatingPhoto || isCreatingReceptionist) && <Loader />}
        </>
    );
};
