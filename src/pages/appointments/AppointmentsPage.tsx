import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { FunctionComponent, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Datepicker from '../../components/DatePicker/Datepicker';
import FilterTextfield from '../../components/FilterTextfield/FilterTextfield';
import Loader from '../../components/Loader/Loader';
import SelectBoolean from '../../components/Select/SelectBoolean';
import { usePagedAppointments } from '../../hooks/appointments';
import { usePagedOffices } from '../../hooks/offices';
import { usePagedServices } from '../../hooks/services';
import { useAppointmentsValidator } from '../../hooks/validators/appointmentsAPI/GetAppointments';
import { IPagingData } from '../../types/common/Responses';
import AppointmentsTable from './AppointmentsTable';
const AppointmentsPage: FunctionComponent = () => {
    const { validationScheme, initialValues } = useAppointmentsValidator();

    const { register, handleSubmit, setError, control, getValues, watch } = useForm({
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
    } = usePagedAppointments({ currentPage: 1, pageSize: 50 } as IPagingData, getValues(), setError);

    const { data: offices, isFetching: isFetchingOffices } = usePagedOffices({ currentPage: 1, pageSize: 50 }, { isActive: true });
    const { data: services, isFetching: isFetchingServices } = usePagedServices(
        { currentPage: 1, pageSize: 20 },
        {
            title: watch('service').input,
            isActive: true,
        }
    );

    const date = useWatch({
        control,
        name: 'date',
    });
    useEffect(() => {
        fetchAppointments();
    }, [date, fetchAppointments]);

    return (
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component={'form'} onSubmit={handleSubmit(() => fetchAppointments())} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FilterTextfield id={register('doctorFullName').name} control={control} displayName='Doctor' />
                    {/* <AutoComplete
                        id={register('office').name}
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
                    /> */}
                    {/* <AutoComplete
                        id={register('service').name}
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
                    /> */}

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

            {(isFetchingAppointments || isFetchingOffices || isFetchingServices) && <Loader />}
        </Box>
    );
};

export default AppointmentsPage;
