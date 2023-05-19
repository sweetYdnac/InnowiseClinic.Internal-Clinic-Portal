import { useMemo } from 'react';
import { ISpecializationResponse } from '../../../types/response/specializations';
import { Yup } from '../YupConfiguration';
import { IServiceForm } from '../services/create&update';

export interface ISpecializationForm {
    title: string;
    isActive: boolean;
    services: IServiceForm[];
}

export const useSpecializationValidator = (specialization: ISpecializationResponse | undefined) => {
    const initialValues = useMemo(
        () =>
            ({
                title: specialization?.title,
                isActive: specialization?.isActive,
                services: [],
            } as ISpecializationForm),
        [specialization?.isActive, specialization?.title]
    );

    const validationScheme = Yup.object().shape({
        title: Yup.string().required('Please, enter the title'),
        isActive: Yup.boolean().required().nonNullable(),
        services: Yup.array().of(Yup.mixed<IServiceForm>()).required('Please add at least one service'),
    });

    return { initialValues, validationScheme };
};
