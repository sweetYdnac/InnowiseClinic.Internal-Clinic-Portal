import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetAllServiceCategories } from '../../../hooks/requests/servicesCategories';
import { useAppDispatch } from '../../../hooks/store';
import { useServiceValidator } from '../../../hooks/validators/services/create&update';
import { closeModal } from '../../../store/modalsSlice';
import { addService } from '../../../store/servicesSlice';
import { IAutoCompleteItem } from '../../../types/common/Autocomplete';
import { DialogWindow } from '../../Dialog';
import { StyledForm, StyledOperationsButtons } from '../../Form';
import { StyledModal } from '../../Modal/CustomModal.styles';
import { AutoComplete } from '../../UI/AutoComplete';
import { SubmitButton } from '../../UI/SubmitButton';
import { Textfield } from '../../UI/Textfield';
import { ToggleSwitch } from '../../UI/ToggleSwitch';

export const CreateServiceModal = () => {
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const { initialValues, formValidationScheme } = useServiceValidator();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, touchedFields },
        control,
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(formValidationScheme),
        defaultValues: initialValues,
    });

    const { data: categories, isFetching: isFetchingCategories, refetch: fetchCategories } = useGetAllServiceCategories();

    const categoriesOptions = useMemo(
        () =>
            categories?.map(
                (item) =>
                    ({
                        id: item.id,
                        label: item.title,
                    } as IAutoCompleteItem)
            ) ?? [],
        [categories]
    );

    useEffect(() => {
        setValue('categoryDuration', categories?.find((item) => item.id === watch('categoryId'))?.timeSlotSize ?? 0);
    }, [categories, watch('categoryId')]);

    const handleClose = useCallback(() => {
        dispatch(closeModal());
    }, [dispatch]);

    const onSubmit = useCallback(() => {
        dispatch(addService(watch()));
        handleClose();
    }, [dispatch, watch]);

    return (
        <StyledModal>
            <StyledForm onSubmit={handleSubmit(() => onSubmit())} component='form' noValidate autoComplete='on'>
                <Typography variant='h5' gutterBottom>
                    Create Service
                </Typography>

                <Textfield id={register('title').name} control={control} displayName='Title' workMode='edit' />
                <Textfield
                    id={register('price').name}
                    control={control}
                    displayName='Price'
                    workMode='edit'
                    inputMode='numeric'
                    endAdornment={<>$</>}
                />

                <ToggleSwitch
                    value={watch('isActive')}
                    handleChange={(value) => setValue('isActive', value, { shouldTouch: true, shouldValidate: true })}
                />

                <AutoComplete
                    valueFieldName={register('categoryId').name}
                    control={control}
                    displayName='Category'
                    options={categoriesOptions}
                    isFetching={isFetchingCategories}
                    handleOpen={() => {
                        if (!categories) {
                            fetchCategories();
                        }
                    }}
                    handleInputChange={() => fetchCategories()}
                    inputFieldName={register('categoryInput').name}
                    debounceDelay={2000}
                />

                <StyledOperationsButtons>
                    <Button variant='contained' color='error' onClick={() => setIsDiscardDialogOpen(true)}>
                        Cancel
                    </Button>
                    <SubmitButton errors={errors} shouldBeTouched={[touchedFields.title, touchedFields.price, touchedFields.categoryId]}>
                        Save changes
                    </SubmitButton>
                </StyledOperationsButtons>
            </StyledForm>

            <DialogWindow
                isOpen={isDiscardDialogOpen}
                title='Discard changes?'
                content='Do you really want to cancel? Entered data will not be saved.'
                handleSubmit={() => {
                    handleClose();
                }}
                handleDecline={() => setIsDiscardDialogOpen(false)}
            />
        </StyledModal>
    );
};
