import { Yup } from '../YupConfiguration';

export interface IGetPatientsForm {
    currentPage: number;
    pageSize: number;
    fullName?: string;
    patientInput?: string;
}

export const useGetPatientsValidator = () => {
    const initialValues: IGetPatientsForm = {
        currentPage: 1,
        pageSize: 10,
        fullName: '',
        patientInput: '',
    };

    const validationScheme = Yup.object().shape({
        currentPage: Yup.number().moreThan(0, 'Page number should be greater than 0').required(),
        pageSize: Yup.number().min(1).max(50).required('Page size is required'),
        fullName: Yup.string().notRequired(),
        patientInput: Yup.string().notRequired(),
    });

    return { validationScheme, initialValues };
};
