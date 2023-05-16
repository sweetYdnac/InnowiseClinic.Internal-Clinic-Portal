import { useMemo } from 'react';
import { Yup } from '../YupConfiguration';

export const useGetTimeSlotsValidator = () => {
    const validationScheme = useMemo(() => {
        return Yup.object().shape({
            date: Yup.string().hasDateApiFormat().required('Please enter a date'),
            doctors: Yup.array().of(Yup.string()).required('Doctors field is required'),
            startTime: Yup.string().hasTimeSlotFormat().required('Please enter a start time'),
            endTime: Yup.string().hasTimeSlotFormat().required('Please enter a end time'),
            duration: Yup.number().positive().dividedBy(10).required('Appointment duration is required'),
        });
    }, []);

    return { validationScheme };
};
