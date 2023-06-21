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
import { ServicesTable } from '../../components/ServicesTable';
import { SubmitButton } from '../../components/UI/SubmitButton';
import { Textfield } from '../../components/UI/Textfield';
import { ToggleSwitch } from '../../components/UI/ToggleSwitch';
import { WorkMode } from '../../constants/WorkModes';
import { useCreateServiceCommand, usePagedServicesQuery } from '../../hooks/requests/services';
import { useSpecializationQuery, useUpdateSpecializationCommand } from '../../hooks/requests/specializations';
import { useAppSelector } from '../../hooks/store';
import { useSpecializationValidator } from '../../hooks/validators/specializations/create&update';
import { selectServices } from '../../store/servicesSlice';
import { IPagedRequest } from '../../types/common/Requests';

export const SpecializationInformationPage = () => {
    const { id } = useParams();
    const newServices = useAppSelector(selectServices);
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
        if (!deepEqual(watch(), defaultValues)) {
            updateSpecialization(undefined, {
                onSuccess: () => {
                    reset(watch());
                    setWorkMode('view');
                },
            });
        } else {
            setWorkMode('view');
        }

        newServices.forEach((item) => createService({ ...item, specializationId: id as string }));
    }, [createService, defaultValues, id, newServices, reset, updateSpecialization, watch]);

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

                    <StyledForm onSubmit={handleSubmit(() => onSubmit())} component='form' noValidate autoComplete='on'>
                        <Textfield id={register('title').name} control={control} displayName='Title' workMode={workMode} />
                        <ToggleSwitch
                            disabled={workMode === 'view'}
                            value={watch('isActive')}
                            handleChange={(_, value) => setValue('isActive', value, { shouldTouch: true, shouldValidate: true })}
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
                            />
                        )}

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

            {isUpdatingSpecialization && <Loader />}
        </>
    );
};
