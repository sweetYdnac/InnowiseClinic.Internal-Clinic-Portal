import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import AppointmentsService from '../../api/services/AppointmentsService';
import { dateApiFormat } from '../../constants/formats';
import { useAppSelector } from '../../hooks/store';
import { selectProfile } from '../../store/profileSlice';
import IPagedResponse from '../../types/common/responses/IPagedResponse';
import { IGetAppointmentsRequest } from '../../types/request/AppointmentsAPI_requests';
import { IAppointmentResponse } from '../../types/response/AppointmentsAPI_responses';
import { GET_APPOINTMENTS_VALIDATOR, IGetAppointmentsForm, initialValues } from '../../validators/appointmentsAPI/GetAppointments';

interface AppointmentsProps {}

const Appointments: FunctionComponent<AppointmentsProps> = () => {
    const profile = useAppSelector(selectProfile);

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, touchedFields, defaultValues },
        getValues,
    } = useForm<IGetAppointmentsForm>({
        mode: 'onBlur',
        resolver: yupResolver(GET_APPOINTMENTS_VALIDATOR),
        defaultValues: initialValues,
    });

    const { data, refetch } = useQuery<any, Error, IPagedResponse<IAppointmentResponse>>({
        queryKey: ['getAppointments', getValues()],
        queryFn: async () => {
            const request: IGetAppointmentsRequest = {
                ...getValues(),
                date: dayjs(getValues().date).format(dateApiFormat),
            };

            return await AppointmentsService.getAppointments(request);
        },
        enabled: false,
        keepPreviousData: true,
    });

    return <div>Appointments view!</div>;
};

export default Appointments;
