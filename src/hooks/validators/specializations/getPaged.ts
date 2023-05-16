import { useMemo } from 'react';
import { Yup } from '../YupConfiguration';

export const useGetPagedSpecializationsValidator = () => {
    const validationScheme = useMemo(() => {
        return Yup.object().shape({
            currentPage: Yup.number().moreThan(0, 'Page number should be greater than 0').required(),
            pageSize: Yup.number().min(1).max(50).required('Page size is required'),
            isActive: Yup.boolean().required('Please enter a status'),
        });
    }, []);

    return { validationScheme };
};
