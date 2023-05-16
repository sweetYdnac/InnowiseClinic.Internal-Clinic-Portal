import { Yup } from '../../hooks/validators/YupConfiguration';
import { IPagedRequest } from '../common/Requests';

export interface IGetPagedDoctorsRequest extends IPagedRequest {
    onlyAtWork: boolean;
    officeId?: string | null;
    specializationId?: string | null;
    fullName?: string;
}

export const getPagedDoctorRequestValidator = Yup.object().shape({
    currentPage: Yup.number().moreThan(0, 'Page number should be greater than 0').required(),
    pageSize: Yup.number().min(1).max(50).required(),
    onlyAtWork: Yup.boolean().required(),
    officeId: Yup.string().notRequired(),
    specializationId: Yup.string().notRequired(),
    fullName: Yup.string().notRequired(),
});

export interface ICreateDoctorRequest {
    id: string;
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    specializationId: string;
    officeId: string;
    careerStartYear: number;
    specializationName: string;
    officeAddress: string;
    status: number;
}

export interface IUpdateDoctorRequest {
    photoId: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    officeId: string;
    officeAddress: string;
    specializationId: string;
    specializationName: string;
    careerStartYear: number;
    status: number;
}
