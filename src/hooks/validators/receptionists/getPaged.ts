import { useMemo } from 'react';
import { IPagedRequest } from '../../../types/common/Requests';
import { Yup } from '../YupConfiguration';

export interface IGetReceptionistsForm extends IPagedRequest {}

export const useGetReceptionistsValidator = (pagedData: IPagedRequest) => {
    const initialValues = useMemo(
        () =>
            ({
                ...pagedData,
            } as IGetReceptionistsForm),
        [pagedData]
    );

    const validationScheme = Yup.object().shape({
        currentPage: Yup.number().moreThan(0, 'Page number should be greater than 0').required(),
        pageSize: Yup.number().min(1).max(50).required('Page size is required'),
    });

    return { validationScheme, initialValues };
};
