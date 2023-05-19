import { yupResolver } from '@hookform/resolvers/yup';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Box, Button, IconButton } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DialogWindow } from '../../components/Dialog/DialogWindow';
import { Loader } from '../../components/Loader/Loader';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { ToggleSwitch } from '../../components/Switch/ToggleSwitch';
import { Textfield } from '../../components/Textfield/Textfield';
import { WorkMode } from '../../constants/WorkModes';
import { useCreateServiceCommand, usePagedServicesQuery } from '../../hooks/requests/services';
import { useSpecializationQuery, useUpdateSpecializationCommand } from '../../hooks/requests/specializations';
import { useSpecializationValidator } from '../../hooks/validators/specializations/create&update';
import { IPagedRequest } from '../../types/common/Requests';
import { ServicesTable } from '../services/ServicesTable';

export const SpecializationInformationPage = () => {
    const { id } = useParams();
    const [workMode, setWorkMode] = useState<WorkMode>('view');
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
    const [servicesPagingData, setServicesPagingData] = useState<IPagedRequest>({
        currentPage: 1,
        pageSize: 10,
    });

    const { data: specialization, isFetching: isFetchingSpecialization } = useSpecializationQuery(id as string, true);
    const { data: services, isFetching: isFetchingServices } = usePagedServicesQuery(
        {
            currentPage: servicesPagingData.currentPage,
            pageSize: servicesPagingData.pageSize,
            isActive: null,
            specializationId: specialization?.id,
        },
        !!specialization
    );

    const { initialValues, validationScheme } = useSpecializationValidator(specialization);

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

    const { mutate: updateSpecialization, isLoading: isUpdatingSpecialization } = useUpdateSpecializationCommand(
        id as string,
        watch(),
        setError
    );

    const { mutate: createService } = useCreateServiceCommand();

    const handleChangePage = useCallback((page: number) => {
        setServicesPagingData((prev) => {
            return {
                ...prev,
                currentPage: page,
            };
        });
    }, []);

    const onSubmit = useCallback(() => {
        updateSpecialization(undefined, {
            onSuccess: () => {
                reset(watch());
                setWorkMode('view');
            },
        });

        watch('services').forEach((item) => createService({ ...item, specializationId: id as string }));
    }, [createService, id, reset, updateSpecialization, watch]);

    return (
        <>
            {isFetchingSpecialization || isFetchingServices ? (
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
                        <Textfield id={register('title').name} control={control} displayName='Title' workMode={workMode} />
                        <ToggleSwitch
                            disabled={workMode === 'view'}
                            value={watch('isActive')}
                            handleChange={(value) => setValue('isActive', value, { shouldTouch: true, shouldValidate: true })}
                        />

                        {services && (
                            <ServicesTable
                                existedServices={services?.items}
                                pagingData={{
                                    currentPage: services?.currentPage,
                                    pageSize: services.pageSize,
                                    totalCount: services.totalCount,
                                    totalPages: services.totalPages,
                                }}
                                handlePageChange={(_, page) => handleChangePage(page + 1)}
                                workMode={workMode}
                                newServices={watch('services')}
                            />
                        )}

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

            {isUpdatingSpecialization && <Loader />}
        </>
    );
};
