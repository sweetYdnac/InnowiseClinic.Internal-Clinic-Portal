import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { SubmitButton } from '../../components/SubmitButton/SubmitButton';
import { ToggleSwitch } from '../../components/Switch/ToggleSwitch';
import { Textfield } from '../../components/Textfield/Textfield';
import { useCreateServiceCommand } from '../../hooks/requests/services';
import { useCreateSpecializationCommand } from '../../hooks/requests/specializations';
import { useAppSelector } from '../../hooks/store';
import { useSpecializationValidator } from '../../hooks/validators/specializations/create&update';
import { AppRoutes } from '../../routes/AppRoutes';
import { selectServices } from '../../store/servicesSlice';
import { IPagedRequest } from '../../types/common/Requests';
import { ServicesTable } from '../services/ServicesTable';

export const CreateSpecializationPage = () => {
    const navigate = useNavigate();
    const services = useAppSelector(selectServices);
    const [servicesPagingData, setServicesPagingData] = useState<IPagedRequest>({
        currentPage: 1,
        pageSize: 10,
    });
    const { initialValues, validationScheme } = useSpecializationValidator();
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

    const handleChangePage = useCallback((page: number) => {
        setServicesPagingData((prev) => ({
            ...prev,
            currentPage: page,
        }));
    }, []);

    const { mutate: createSpecialization, isLoading } = useCreateSpecializationCommand(watch(), setError);
    const { mutate: createService } = useCreateServiceCommand();

    const onSubmit = useCallback(() => {
        createSpecialization(undefined, {
            onSuccess: (response) => {
                services.forEach((item) => createService({ ...item, specializationId: response.id }));
                navigate(AppRoutes.Specializations);
            },
        });
    }, [createService, createSpecialization, navigate, services]);

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
                <Textfield id={register('title').name} control={control} displayName='Title' workMode='edit' />
                <ToggleSwitch
                    value={watch('isActive')}
                    handleChange={(value) => setValue('isActive', value, { shouldTouch: true, shouldValidate: true })}
                />

                <ServicesTable
                    pagingData={{
                        currentPage: servicesPagingData.currentPage,
                        pageSize: servicesPagingData.pageSize,
                        totalCount: services.length,
                        totalPages: services.length / servicesPagingData.pageSize,
                    }}
                    handlePageChange={(_, page) => handleChangePage(page + 1)}
                    workMode='edit'
                />
                <SubmitButton errors={errors} shouldBeTouched={[touchedFields.title, services.length > 0]}>
                    Create
                </SubmitButton>
            </Box>

            {isLoading && <Loader />}
        </>
    );
};
