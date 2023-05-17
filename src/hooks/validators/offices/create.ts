import { Yup } from '../YupConfiguration';

export interface ICreateOfficeForm {
    city: string;
    street: string;
    houseNumber: string;
    officeNumber: string;
    registryPhoneNumber: string;
    isActive: boolean;
}

export const useCreateOfficeValidator = () => {
    const initialValues: ICreateOfficeForm = {
        city: '',
        street: '',
        houseNumber: '',
        officeNumber: '',
        registryPhoneNumber: '',
        isActive: false,
    };

    const validationScheme = Yup.object().shape({
        city: Yup.string().required(`Please, enter the office's city`),
        street: Yup.string().required(`Please, enter the office's street`),
        houseNumber: Yup.string().required(`Please, enter the office's house number`),
        officeNumber: Yup.string().required(`Please, enter the office's number`),
        registryPhoneNumber: Yup.string()
            .required('Please, enter a phone number')
            .matches(/^\d+$/, `You've entered an invalid phone number`),
        isActive: Yup.boolean().required(),
    });

    return { validationScheme, initialValues };
};
