import { ISpecializationResponse } from '../../../types/response/specializations';
import { Yup } from '../YupConfiguration';

export interface ISpecializationForm {
    title: string;
    isActive: boolean;
}

export const useSpecializationValidator = (specialization?: ISpecializationResponse) => {
    const initialValues: ISpecializationForm = {
        title: specialization?.title ?? '',
        isActive: specialization?.isActive ?? false,
    };

    const validationScheme = Yup.object().shape({
        title: Yup.string().required('Please, enter the title'),
        isActive: Yup.boolean().nonNullable(),
    });

    return { initialValues, validationScheme };
};
