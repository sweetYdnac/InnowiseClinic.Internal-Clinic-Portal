import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { deepEqual } from 'fast-equals';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { DialogWindow } from '../../components/Dialog/DialogWindow';
import { Loader } from '../../components/Loader/Loader';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { Textfield } from '../../components/Textfield/Textfield';
import { ToggleSwitch } from '../../components/ToggleSwitch/ToggleSwitch';
import { WorkMode } from '../../constants/WorkModes';
import { useGetServiceByIdQuery, useUpdateServiceCommand } from '../../hooks/requests/services';
import { useGetAllServiceCategories } from '../../hooks/requests/servicesCategories';
import { useAppDispatch } from '../../hooks/store';
import { useServiceValidator } from '../../hooks/validators/services/create&update';
import { closeModal } from '../../store/modalsSlice';
import '../../styles/ModalWindow.css';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

interface ServiceModalProps {
    id: string;
    initialWorkMode: WorkMode;
}

export const ServiceModal: FunctionComponent<ServiceModalProps> = ({ id, initialWorkMode }: ServiceModalProps) => {
    const [workMode, setMode] = useState<WorkMode>(initialWorkMode);
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const { data: service, isFetching: isFetchingService } = useGetServiceByIdQuery(id);
    const { initialValues, formValidationScheme } = useServiceValidator(service);
    const dispatch = useAppDispatch();

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
        resolver: yupResolver(formValidationScheme),
        defaultValues: initialValues,
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);

    const { data: categories, isFetching: isFetchingCategories, refetch: fetchCategories } = useGetAllServiceCategories();

    useEffect(() => {
        setValue('categoryDuration', categories?.find((item) => item.id === watch('categoryId'))?.timeSlotSize ?? 0);
        reset(watch());
    }, [categories]);

    const categoriesOptions = useMemo(
        () =>
            categories && categories.length > 0
                ? categories?.map(
                      (item) =>
                          ({
                              id: item.id,
                              label: item.title,
                          } as IAutoCompleteItem)
                  ) ?? []
                : [
                      {
                          label: service?.categoryTitle,
                          id: service?.categoryId,
                      } as IAutoCompleteItem,
                  ],
        [categories, service?.categoryId, service?.categoryTitle]
    );

    const handleClose = useCallback(() => {
        dispatch(closeModal());
    }, [dispatch]);

    const { mutate: updateService, isLoading: isUpdatingService } = useUpdateServiceCommand(watch(), setError);

    const onSubmit = useCallback(() => {
        if (!deepEqual(watch(), defaultValues)) {
            updateService(
                { id },
                {
                    onSuccess: () => handleClose(),
                }
            );
        } else {
            handleClose();
        }
    }, [defaultValues, handleClose, id, updateService, watch]);

    return (
        <Modal open={true}>
            <>
                {isFetchingService || isFetchingCategories ? (
                    <Loader />
                ) : (
                    <>
                        <Box className='modal-box' component='div'>
                            {workMode === 'view' && (
                                <Box component='div' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <IconButton onClick={() => setMode('edit')}>
                                        <ModeEditIcon fontSize='medium' />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => {
                                            if (workMode === 'view') {
                                                handleClose();
                                            }
                                        }}
                                    >
                                        <CloseIcon fontSize='medium' />
                                    </IconButton>
                                </Box>
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
                                <Typography variant='h5' gutterBottom>
                                    Service
                                </Typography>

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
                                    valueFieldName={register('categoryId').name}
                                    control={control}
                                    displayName='Category'
                                    options={categoriesOptions}
                                    isFetching={isFetchingCategories}
                                    handleOpen={() => {
                                        if (workMode === 'edit' && !categories) {
                                            fetchCategories();
                                        }
                                    }}
                                    handleInputChange={() => fetchCategories()}
                                    inputFieldName={register('categoryInput').name}
                                    debounceDelay={2000}
                                />

                                {workMode === 'edit' && (
                                    <Box
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
                                    </Box>
                                )}
                            </Box>

                            <DialogWindow
                                isOpen={isDiscardDialogOpen}
                                title='Discard changes?'
                                content='Do you really want to cancel? Changes will not be saved.'
                                handleSubmit={() => {
                                    reset();
                                    handleClose();
                                }}
                                handleDecline={() => setIsDiscardDialogOpen(false)}
                            />
                        </Box>
                    </>
                )}

                {isUpdatingService && <Loader />}
            </>
        </Modal>
    );
};
