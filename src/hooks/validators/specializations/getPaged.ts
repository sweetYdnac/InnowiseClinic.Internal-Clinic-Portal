import { useMemo } from 'react';
import * as yup from 'yup';

export const useGetPagedSpecializationsValidator = () => {
    const validationScheme = useMemo(() => {
        return yup.object().shape({
            currentPage: yup.number().moreThan(0, 'Page number should be greater than 0').required('Please enter a page number'),
            pageSize: yup.number().min(1).max(50).required('Please enter a page size'),
            isActive: yup.boolean().required('Please enter a status'),
        });
    }, []);

    return { validationScheme };
};
