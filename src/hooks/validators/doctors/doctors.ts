import { useMemo } from 'react';
import * as yup from 'yup';

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
        return yup.object().shape({
            currentPage: yup.number().moreThan(0, 'Page number should be greater than 0').required(),
            pageSize: yup.number().min(1).max(50).required(),
            doctorValue: yup.string().notRequired(),
            doctorInput: yup.string().notRequired(),
            officeId: yup.string().notRequired(),
            officeInput: yup.string().notRequired(),
            specializationId: yup.string().notRequired(),
            specializationInput: yup.string().notRequired(),
        });
    }, []);

    return { validationScheme, initialValues };
};
