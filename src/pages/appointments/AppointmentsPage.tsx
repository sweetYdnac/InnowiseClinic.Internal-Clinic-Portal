import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { FunctionComponent, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AutoComplete } from '../../components/AutoComplete/AutoComplete';
import { Datepicker } from '../../components/DatePicker/Datepicker';
import { Loader } from '../../components/Loader/Loader';
import { SelectBoolean } from '../../components/Select/SelectBoolean';
import { dateApiFormat } from '../../constants/formats';
import { usePagedAppointmentsQuery } from '../../hooks/appointments';
import { usePagedDoctorsQuery } from '../../hooks/doctors';
import { usePagedOfficesQuery } from '../../hooks/offices';
import { usePagedServicesQuery } from '../../hooks/services';
import { useAppointmentsValidator } from '../../hooks/validators/appointments/getPaged';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { AppointmentsTable } from './AppointmentsTable';

export const AppointmentsPage: FunctionComponent = () => {
    const { validationScheme, initialValues } = useAppointmentsValidator();

    const { register, setError, control, getValues, watch, setValue } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

    const { data: appointments, isFetching: isFetchingAppointments } = usePagedAppointmentsQuery(
        {
            currentPage: watch('currentPage'),
            pageSize: watch('pageSize'),
            date: watch('date')?.format(dateApiFormat) as string,
            doctorFullName: watch('doctorInput'),
            serviceId: watch('serviceId'),
            officeId: watch('officeId'),
            isApproved: watch('isApproved'),
        },
        setError,
        true
    );

    const {
        data: offices,
        isFetching: isOfficesFetching,
        refetch: fetchOffices,
    } = usePagedOfficesQuery({ currentPage: 1, pageSize: 50, isActive: true });

    const {
        data: doctors,
        isFetching: isDoctorsFetching,
        refetch: fetchDoctors,
    } = usePagedDoctorsQuery({
        currentPage: 1,
        pageSize: 20,
        onlyAtWork: true,
        officeId: watch('officeId'),
        fullName: watch('doctorInput'),
        specializationId: watch('specializationId'),
    });

    const {
        data: services,
        isFetching: isServicesFetching,
        refetch: fetchServices,
    } = usePagedServicesQuery({
        currentPage: 1,
        pageSize: 20,
        isActive: true,
        title: watch('serviceInput'),
        specializationId: watch('specializationId'),
    });

    useEffect(() => {
        if (!getValues('doctorId') && !getValues('serviceId')) {
            setValue('specializationId', '');
            return;
        }

        let specializationId = '';

        if (getValues('doctorId') && !getValues('specializationId')) {
            specializationId = doctors?.items?.find((item) => item.id === getValues('doctorId'))?.specializationId || '';
        }

        if (getValues('serviceId') && !getValues('specializationId')) {
            specializationId = services?.items.find((item) => item.id === getValues('serviceId'))?.specializationId || '';
        }

        setValue('specializationId', specializationId);
    }, [watch('doctorId'), watch('serviceId')]);

    useEffect(() => {
        setValue('currentPage', 1);
    }, [watch('pageSize'), watch('date'), watch('doctorInput'), watch('serviceId'), watch('officeId'), watch('isApproved')]);

    const getDoctorsOptions = useCallback(() => {
        if (getValues('doctorId')) {
            const doctor = doctors?.items?.find((doctor) => doctor.id === getValues('doctorId'));
            return [
                {
                    label: doctor?.officeAddress,
                    id: doctor?.officeId,
                } as IAutoCompleteItem,
            ];
        }

        return (
            offices?.items?.map((item) => ({
                label: item.address,
                id: item.id,
            })) ?? []
        );
    }, [doctors, getValues, offices]);

    return (
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <AutoComplete
                        valueFieldName={register('doctorId').name}
                        control={control}
                        displayName='Doctor'
                        options={
                            doctors?.items?.map((item) => {
                                return {
                                    label: item.fullName,
                                    id: item.id,
                                } as IAutoCompleteItem;
                            }) ?? []
                        }
                        isFetching={isDoctorsFetching}
                        handleOpen={() => {
                            if (!getValues('doctorId')) {
                                fetchDoctors();
                            }
                        }}
                        handleInputChange={() => fetchDoctors()}
                        inputFieldName={register('doctorInput').name}
                        debounceDelay={2000}
                    />

                    <AutoComplete
                        valueFieldName={register('officeId').name}
                        control={control}
                        displayName='Office'
                        options={getDoctorsOptions()}
                        isFetching={isOfficesFetching}
                        handleOpen={() => {
                            if (!getValues('officeId') && !getValues('doctorId')) {
                                fetchOffices();
                            }
                        }}
                        handleInputChange={() => fetchOffices()}
                        inputFieldName={register('officeInput').name}
                        debounceDelay={2000}
                    />

                    <AutoComplete
                        valueFieldName={register('serviceId').name}
                        control={control}
                        displayName='Service'
                        options={
                            services?.items.map((item) => {
                                return {
                                    label: item.title,
                                    id: item.id,
                                } as IAutoCompleteItem;
                            }) ?? []
                        }
                        isFetching={isServicesFetching}
                        handleOpen={() => {
                            if (!getValues('serviceId')) {
                                fetchServices();
                            }
                        }}
                        handleInputChange={() => fetchServices()}
                        inputFieldName={register('serviceInput').name}
                        debounceDelay={2000}
                    />

                    <SelectBoolean id={register('isApproved').name} control={control} displayName='Status' />
                    <Datepicker id={register('date').name} control={control} displayName='Date' />
                </Box>
                <Box>
                    {appointments && (
                        <AppointmentsTable
                            appointments={appointments.items}
                            pagingData={{
                                currentPage: appointments.currentPage,
                                pageSize: appointments.pageSize,
                                totalCount: appointments.totalCount,
                                totalPages: appointments.totalPages,
                            }}
                            handlePageChange={(_, page) => setValue('currentPage', page + 1)}
                        />
                    )}
                </Box>
            </Box>

            {isFetchingAppointments && <Loader />}
        </Box>
    );
};
