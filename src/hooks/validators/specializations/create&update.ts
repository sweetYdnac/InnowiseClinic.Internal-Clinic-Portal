import { useMemo } from 'react';
import { selectServices } from '../../../store/servicesSlice';
import { ISpecializationResponse } from '../../../types/response/specializations';
import { useAppSelector } from '../../store';
import { Yup } from '../YupConfiguration';
import { IServiceForm } from '../services/create&update';

export interface ISpecializationForm {
    title: string;
    isActive: boolean;
    services: IServiceForm[];
}

export const useSpecializationValidator = (specialization: ISpecializationResponse | undefined) => {
    const services = useAppSelector(selectServices);

    const initialValues = useMemo(
        () =>
            ({
                title: specialization?.title,
                isActive: specialization?.isActive,
                services: services,
            } as ISpecializationForm),
        [services, specialization?.isActive, specialization?.title]
    );

    const validationScheme = Yup.object().shape({
        title: Yup.string().required('Please, enter the title'),
        isActive: Yup.boolean().required().nonNullable(),
        services: Yup.array().of(Yup.mixed<IServiceForm>()).required('Please add at least one service'),
    });

    return { initialValues, validationScheme };
};
