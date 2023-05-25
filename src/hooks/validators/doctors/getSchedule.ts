import dayjs from 'dayjs';
import { useMemo } from 'react';
import { IPagedRequest } from '../../../types/common/Requests';
import { Yup } from '../YupConfiguration';

export interface IGetDoctorScheduleForm extends IPagedRequest {
    date: dayjs.Dayjs;
}

export const useGetDoctorScheduleValidator = (pagedData: IPagedRequest) => {
    const initialValues = useMemo(
        () =>
            ({
                ...pagedData,
                date: dayjs(),
            } as IGetDoctorScheduleForm),
        [pagedData]
    );

    const formValidationScheme = Yup.object().shape({
        currentPage: Yup.number().moreThan(0, 'Page number should be greater than 0').required(),
        pageSize: Yup.number().min(1).max(50).required('Page size is required'),
        date: Yup.date().required('Please, enter a date').typeError('Please, enter a valid date'),
    });

    const requestValidationScheme = Yup.object().shape({
        date: Yup.string().hasDateApiFormat().required('Please enter a date'),
    });

    return { initialValues, formValidationScheme, requestValidationScheme };
};
