import * as yup from 'yup';

export interface IDoctorsForm {
    doctorFullName: string;
    officeId: string;
    officeInput: string;
    specializationId: string;
    specializationInput: string;
}

export const useDoctorsValidator = () => {
    const initialValues: IDoctorsForm = {
        doctorFullName: '',
        officeId: '',
        officeInput: '',
        specializationId: '',
        specializationInput: '',
    };

    const validationScheme = yup.object().shape({
        doctorFullName: yup.string().notRequired(),
        officeId: yup.string().notRequired(),
        officeInput: yup.string().notRequired(),
        specializationId: yup.string().notRequired(),
        specializationInput: yup.string().notRequired(),
    });

    return { validationScheme, initialValues };
};
