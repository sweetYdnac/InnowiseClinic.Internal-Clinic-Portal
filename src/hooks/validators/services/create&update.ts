import { useMemo } from 'react';
import { IServiceResponse } from '../../../types/response/services';
import { Yup } from '../YupConfiguration';

export interface IServiceForm {
    title: string;
    price: number;
    specializationId: string;
    categoryId: string;
    categoryInput: string;
    categoryDuration: number;
    isActive: boolean;
}

export const useServiceValidator = (service?: IServiceResponse) => {
    const initialValues = useMemo(
        () =>
            ({
                title: service?.title ?? '',
                price: service?.price,
                specializationId: service?.specializationId ?? '',
                categoryId: service?.categoryId ?? '',
                categoryInput: service?.categoryTitle ?? '',
                categoryDuration: 0,
                isActive: service?.isActive ?? false,
            } as IServiceForm),
        [service?.categoryId, service?.categoryTitle, service?.isActive, service?.price, service?.specializationId, service?.title]
    );

    const formValidationScheme = Yup.object().shape({
        title: Yup.string().required('Please, enter the title'),
        price: Yup.number()
            .moreThan(0, `You've entered an invalid price`)
            .required('Please, enter the price')
            .typeError(`You've entered an invalid price`),
        categoryId: Yup.string().required('Please, choose the service category'),
        categoryInput: Yup.string().required('Please, choose the service category'),
        categoryDuration: Yup.number().positive().dividedBy(10).required('Appointment duration is required'),
        isActive: Yup.boolean().required().nonNullable(),
    });

    const requestValidationScheme = Yup.object().shape({
        title: Yup.string().required('Please, enter the title'),
        price: Yup.number().moreThan(0, `You've entered an invalid price`).required('Please, enter the price'),
        specializationId: Yup.string().required('Please, enter the specialization'),
        categoryId: Yup.string().required('Please, choose the service category'),
        categoryInput: Yup.string().required('Please, choose the service category'),
        categoryDuration: Yup.number().positive().dividedBy(10).required('Appointment duration is required'),
        isActive: Yup.boolean().required().nonNullable(),
    });

    return { initialValues, formValidationScheme, requestValidationScheme };
};
