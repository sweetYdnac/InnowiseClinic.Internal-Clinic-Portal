import { useMemo } from 'react';
import { AccountStatuses } from '../../../constants/AccountStatuses';
import { IReceptionistsResponse } from '../../../types/response/receptionists';
import { Yup } from '../YupConfiguration';

export interface IUpdateReceptionistForm {
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    officeId: string;
    officeAddress: string;
    status: number;
}

export const useReceptionistValidator = (receptionist?: IReceptionistsResponse) => {
    const initialValues = useMemo(
        () =>
            ({
                ...receptionist,
                photoId: null,
            } as IUpdateReceptionistForm),
        [receptionist]
    );

    const validationScheme = Yup.object().shape({
        photoId: Yup.string().notRequired(),
        firstName: Yup.string().required('Please, enter the first name'),
        lastName: Yup.string().required('Please, enter the last name'),
        middleName: Yup.string().notRequired(),
        officeId: Yup.string().required('Please, choose the office'),
        officeAddress: Yup.string().required('Invalid office address'),
        status: Yup.mixed<AccountStatuses>().oneOf(Object.values(AccountStatuses) as AccountStatuses[], 'Please select the status'),
    });

    return { validationScheme, initialValues };
};
