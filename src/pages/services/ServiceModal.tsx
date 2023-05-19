import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { DialogWindow } from '../../components/Dialog/DialogWindow';
import { Loader } from '../../components/Loader/Loader';
import '../../components/Modal/ModalWindow.css';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { ToggleSwitch } from '../../components/Switch/ToggleSwitch';
import { Textfield } from '../../components/Textfield/Textfield';
import { WorkMode } from '../../constants/WorkModes';
import { useGetServiceByIdQuery, useUpdateServiceCommand } from '../../hooks/requests/services';
import { useGetAllServiceCategories } from '../../hooks/requests/servicesCategories';
import { useServiceValidator } from '../../hooks/validators/services/create&update';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

interface ServiceModalProps {
    id: string;
    isOpen: boolean;
    handleClose: () => void;
}

export const ServiceModal: FunctionComponent<ServiceModalProps> = ({ id, isOpen, handleClose }: ServiceModalProps) => {
    const [workMode, setWorkMode] = useState<WorkMode>('view');
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const { data: service, isFetching: isFetchingService } = useGetServiceByIdQuery(id);
    const { initialValues, validationScheme } = useServiceValidator(service);

    const {
        register,
        handleSubmit,
        setError,
        watch,
        reset,
        setValue,
        formState: { errors },
        control,
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);

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

    const { mutate: updateService, isLoading: isUpdatingService } = useUpdateServiceCommand(watch(), setError);

    const onSubmit = useCallback(() => {
        updateService(
            { id },
            {
                onSuccess: () => handleClose(),
            }
        );
    }, [handleClose, id, updateService]);

    return (
        <>
            <Modal open={isOpen}>
                <Box className='modal-box' component='div'>
                    {isFetchingService || isFetchingCategories ? (
                        <Loader />
                    ) : (
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
                                <Textfield id={register('title').name} control={control} displayName='Title' workMode={workMode} />
                                <Textfield
                                    id={register('price').name}
                                    control={control}
                                    displayName='Price'
                                    workMode={workMode}
                                    inputMode='numeric'
                                    endAdornment={<>$</>}
                                />

                                <ToggleSwitch
                                    disabled={workMode === 'view'}
                                    value={watch('isActive')}
                                    handleChange={(value) => setValue('isActive', value, { shouldTouch: true, shouldValidate: true })}
                                />

                                <AutoComplete
                                    readonly={workMode === 'view'}
                                    valueFieldName={register('specializationId').name}
                                    control={control}
                                    displayName='Specialization'
                                    options={categoriesOptions}
                                    isFetching={isFetchingCategories}
                                    handleOpen={() => fetchCategories()}
                                    handleInputChange={() => fetchCategories()}
                                    inputFieldName={register('categoryInput').name}
                                    debounceDelay={2000}
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

                    {isUpdatingService && <Loader />}
                </Box>
            </Modal>
        </>
    );
};
