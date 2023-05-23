import { useMemo } from 'react';
import { IPagedRequest } from '../../../types/common/Requests';
import { Yup } from '../YupConfiguration';

export interface IPatientHistoryForm {
    currentPage: number;
    pageSize: number;
    isFinished: boolean;
}

export const usePatientHistoryValidator = (pagedData: IPagedRequest) => {
    const initialValues = useMemo(
        () =>
            ({
                ...pagedData,
                isFinished: true,
            } as IPatientHistoryForm),
        [pagedData]
    );

    const validationScheme = Yup.object().shape({
        currentPage: Yup.number().moreThan(0, 'Page number should be greater than 0').required(),
        pageSize: Yup.number().min(1).max(50).required('Page size is required'),
        isFinished: Yup.boolean().required().nonNullable(),
    });

    return { validationScheme, initialValues };
};
