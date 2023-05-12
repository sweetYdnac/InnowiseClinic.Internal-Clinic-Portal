import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { FunctionComponent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { Datepicker } from '../../components/DatePicker/Datepicker';
import { Loader } from '../../components/Loader/Loader';
import { SelectBoolean } from '../../components/Select/SelectBoolean';
import { dateApiFormat } from '../../constants/formats';
import { usePagedAppointments } from '../../hooks/appointments';
import { usePagedDoctors } from '../../hooks/doctors';
import { usePagedOffices } from '../../hooks/offices';
import { usePagedServices } from '../../hooks/services';
import { useAppointmentsValidator } from '../../hooks/validators/appointments/getAppointments';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { AppointmentsTable } from './AppointmentsTable';

export const AppointmentsPage: FunctionComponent = () => {
    const { validationScheme, initialValues } = useAppointmentsValidator();

    const { register, handleSubmit, setError, control, getValues, watch, setValue } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const {
        data: appointments,
        refetch: fetchAppointments,
        isFetching: isFetchingAppointments,
        pagingData,
        setPagingData,
    } = usePagedAppointments(
        { currentPage: 1, pageSize: 20 },
        {
            date: watch('date')?.format(dateApiFormat) as string,
            doctorFullName: watch('doctorInput'),
            serviceId: watch('serviceId'),
            officeId: watch('officeId'),
            isApproved: watch('isApproved'),
        },
        setError
    );

    const {
        data: offices,
        isFetching: isOfficesFetching,
        refetch: fetchOffices,
    } = usePagedOffices({ currentPage: 1, pageSize: 50 }, { isActive: true });

    const {
        data: doctors,
        isFetching: isDoctorsFetching,
        refetch: fetchDoctors,
    } = usePagedDoctors(
        { currentPage: 1, pageSize: 20 },
        {
            onlyAtWork: true,
            officeId: watch('officeId'),
            fullName: watch('doctorInput'),
            specializationId: watch('specializationId'),
        }
    );

    const {
        data: services,
        isFetching: isServicesFetching,
        refetch: fetchServices,
    } = usePagedServices(
        { currentPage: 1, pageSize: 20 },
        {
            isActive: true,
            title: watch('serviceInput'),
            specializationId: watch('specializationId'),
        }
    );

    useEffect(() => {
        fetchAppointments();
    }, [watch('date'), fetchAppointments]);

    useEffect(() => {
        if (!getValues('doctorId') && !getValues('serviceId')) {
            setValue('specializationId', '');
            return;
        }

        let specializationId = '';

        if (getValues('doctorId') && !getValues('specializationId')) {
            specializationId = doctors?.find((item) => item.id === getValues('doctorId'))?.specializationId || '';
        }

        if (getValues('serviceId') && !getValues('specializationId')) {
            specializationId = services?.find((item) => item.id === getValues('serviceId'))?.specializationId || '';
        }

        setValue('specializationId', specializationId);
    }, [watch('doctorId'), watch('serviceId')]);

    return (
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component={'form'} onSubmit={handleSubmit(() => fetchAppointments())} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <AutoComplete
                        valueFieldName={register('doctorId').name}
                        control={control}
                        displayName='Doctor'
                        options={
                            doctors?.map((item) => {
                                return {
                                    label: item.fullName,
                                    id: item.id,
                                } as IAutoCompleteItem;
                            }) ?? []
                        }
                        handleFetchOptions={() => fetchDoctors()}
                        isFetching={isDoctorsFetching}
                        inputFieldName={register('doctorInput').name}
                        debounceDelay={2000}
                    />

                    <AutoComplete
                        valueFieldName={register('officeId').name}
                        control={control}
                        displayName='Office'
                        options={
                            offices?.map((item) => {
                                return {
                                    label: item.address,
                                    id: item.id,
                                } as IAutoCompleteItem;
                            }) ?? []
                        }
                        handleFetchOptions={() => fetchOffices()}
                        isFetching={isOfficesFetching}
                        inputFieldName={register('officeInput').name}
                        debounceDelay={2000}
                    />

                    <AutoComplete
                        valueFieldName={register('serviceId').name}
                        control={control}
                        displayName='Service'
                        options={
                            services?.map((item) => {
                                return {
                                    label: item.title,
                                    id: item.id,
                                } as IAutoCompleteItem;
                            }) ?? []
                        }
                        handleFetchOptions={() => fetchServices()}
                        isFetching={isServicesFetching}
                        inputFieldName={register('serviceInput').name}
                        debounceDelay={2000}
                    />

                    <SelectBoolean id={register('isApproved').name} control={control} displayName='Status' />
                    <Datepicker id={register('date').name} control={control} displayName='Date' />
                </Box>
                <Button type='submit'>Generate</Button>
                <Box>
                    {appointments && (
                        <AppointmentsTable
                            appointments={appointments}
                            pagingData={pagingData}
                            handlePageChange={(_, page) =>
                                setPagingData({
                                    ...pagingData,
                                    currentPage: page + 1,
                                })
                            }
                            fetchAppointments={fetchAppointments}
                        />
                    )}
                </Box>
            </Box>

            {isFetchingAppointments && <Loader />}
        </Box>
    );
};
