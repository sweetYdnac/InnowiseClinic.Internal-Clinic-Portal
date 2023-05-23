import { Yup } from '../YupConfiguration';

export const useGetPagedOfficesValidator = () => {
    const validationScheme = Yup.object().shape({
        currentPage: Yup.number().moreThan(0, 'Page number should be greater than 0').required(),
        pageSize: Yup.number().min(1).max(50).required('Page size is required'),
    });

    return { validationScheme };
};
