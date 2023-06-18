import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { FunctionComponent, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Loader } from '../../components/Loader';
import { AutoComplete } from '../../components/UI/AutoComplete';
import { Datepicker } from '../../components/UI/DatePicker';
import { SelectBoolean } from '../../components/UI/SelectBoolean';
import { dateApiFormat } from '../../constants/Formats';
import { usePagedAppointmentsQuery } from '../../hooks/requests/appointments';
import { usePagedDoctorsQuery } from '../../hooks/requests/doctors';
import { usePagedOfficesQuery } from '../../hooks/requests/offices';
import { usePagedServicesQuery } from '../../hooks/requests/services';
import { useAppointmentsValidator } from '../../hooks/validators/appointments/getPaged';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';
import { FiltersBody, StyledForm } from './AppointmentsPage.styles';
import { AppointmentsTable } from './AppointmentsTable/AppointmentsTable';

export const AppointmentsPage: FunctionComponent = () => {
    const { validationScheme, initialValues } = useAppointmentsValidator();

    const { register, control, getValues, watch, setValue } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationScheme),
        defaultValues: initialValues,
    });

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

    const doctorFullName = useMemo(
        () => doctors?.items.find((item) => item.id === getValues('doctorId'))?.fullName ?? getValues('doctorInput'),
        [doctors?.items, getValues]
    );

    const { data: appointments, isFetching: isFetchingAppointments } = usePagedAppointmentsQuery(
        {
            currentPage: watch('currentPage'),
            pageSize: watch('pageSize'),
            date: getValues('date')?.format(dateApiFormat) as string,
            doctorFullName: doctorFullName,
            serviceId: getValues('serviceId'),
            officeId: getValues('officeId'),
            isApproved: getValues('isApproved'),
        },
        true
    );

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
    }, [
        watch('pageSize'),
        watch('date'),
        watch('doctorId'),
        getValues('doctorInput'),
        watch('serviceId'),
        watch('officeId'),
        watch('isApproved'),
    ]);

    const getOfficesOptions = useMemo(() => {
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

    const getDoctorsOptions = useMemo(
        () =>
            doctors?.items?.map((item) => {
                return {
                    label: item.fullName,
                    id: item.id,
                } as IAutoCompleteItem;
            }) ?? [],
        [doctors?.items]
    );

    return (
        <>
            <StyledForm component={'form'}>
                <FiltersBody>
                    <AutoComplete
                        valueFieldName={register('doctorId').name}
                        control={control}
                        displayName='Doctor'
                        options={getDoctorsOptions}
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
                        options={getOfficesOptions}
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
                </FiltersBody>
                <Box>
                    {appointments && (
                        <AppointmentsTable
                            date={watch('date')}
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
            </StyledForm>

            {isFetchingAppointments && <Loader />}
        </>
    );
};
