import { useMemo } from 'react';
import { IOfficeResponse } from '../../../types/response/offices';
import { Yup } from '../YupConfiguration';

export interface IUpdateOfficeForm {
    photoId: string | null;
    city: string;
    street: string;
    houseNumber: string;
    officeNumber: string;
    registryPhoneNumber: string;
    isActive: boolean;
}

export const useUpdateOfficeValidator = (office: IOfficeResponse | undefined) => {
    const initialValues = useMemo(() => {
        const [city, street, houseNumber, officeNumber] = (office?.address ?? '').split(', ');

        return {
            photoId: office?.photoId,
            city: city,
            street: street,
            houseNumber: houseNumber,
            officeNumber: officeNumber,
            registryPhoneNumber: office?.registryPhoneNumber,
            isActive: office?.isActive,
        } as IUpdateOfficeForm;
    }, [office?.address, office?.isActive, office?.photoId, office?.registryPhoneNumber]);

    const validationScheme = Yup.object().shape({
        photoId: Yup.string().notRequired(),
        city: Yup.string().required(`Please, enter the office's city`),
        street: Yup.string().required(`Please, enter the office's street`),
        houseNumber: Yup.string().required(`Please, enter the office's house number`),
        officeNumber: Yup.string().required(`Please, enter the office's number`),
        registryPhoneNumber: Yup.string()
            .required('Please, enter a phone number')
            .matches(/^\d+$/, `You've entered an invalid phone number`),
        isActive: Yup.boolean().required(),
    });

    return { initialValues, validationScheme };
};
