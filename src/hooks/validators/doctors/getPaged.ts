import { useMemo } from 'react';
import { Yup } from '../YupConfiguration';

export interface IDoctorsForm {
    currentPage: number;
    pageSize: number;
    doctorValue: string;
    doctorInput: string;
    officeId: string;
    officeInput: string;
    specializationId: string;
    specializationInput: string;
}

export const useDoctorsValidator = () => {
    const initialValues = useMemo(() => {
        return {
            currentPage: 1,
            pageSize: 10,
            doctorValue: '',
            doctorInput: '',
            officeId: '',
            officeInput: '',
            specializationId: '',
            specializationInput: '',
        } as IDoctorsForm;
    }, []);

    const validationScheme = useMemo(() => {
        return Yup.object().shape({
            currentPage: Yup.number().moreThan(0, 'Page number should be greater than 0').required(),
            pageSize: Yup.number().min(1).max(50).required('Page size is required'),
            doctorValue: Yup.string().notRequired(),
            doctorInput: Yup.string().notRequired(),
            officeId: Yup.string().notRequired(),
            officeInput: Yup.string().notRequired(),
            specializationId: Yup.string().notRequired(),
            specializationInput: Yup.string().notRequired(),
        });
    }, []);

    return { validationScheme, initialValues };
};
