import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Loader } from '../../components/Loader';
import { Datepicker } from '../../components/UI/DatePicker';
import { useGetDoctorScheduleQuery } from '../../hooks/requests/doctors';
import { useGetDoctorScheduleValidator } from '../../hooks/validators/doctors/getSchedule';
import { DoctorScheduleTable } from './DoctorScheduleTable/DoctorScheduleTable';

export const DoctorSchedulePage = () => {
    const { initialValues, formValidationScheme } = useGetDoctorScheduleValidator({ currentPage: 1, pageSize: 10 });
    const { watch, setValue, register, control } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(formValidationScheme),
        defaultValues: initialValues,
    });

    const { data: appointments, isFetching: isFetchigSchedule } = useGetDoctorScheduleQuery(watch(), true);

    return (
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>
                    <Datepicker id={register('date').name} control={control} displayName='Date' disablePast={false} />

                    {appointments && (
                        <DoctorScheduleTable
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

            {isFetchigSchedule && <Loader />}
        </Box>
    );
};
