import { AxiosResponse } from 'axios';
import { IChangeStatusRequest } from '../common/Requests';
import { ICreatedResponse, INoContentResponse } from '../common/Responses';
import { ICreateDoctorRequest, IGetPagedDoctorsRequest, IUpdateDoctorRequest } from '../request/doctors';
import { IDoctorResponse, IPagedDoctorsResponse } from '../response/doctors';

export interface IDoctorsService {
    getById: (id: string) => Promise<IDoctorResponse>;
    getPaged: (data: IGetPagedDoctorsRequest) => Promise<IPagedDoctorsResponse>;
    create: (data: ICreateDoctorRequest) => Promise<ICreatedResponse>;
    update: (id: string, data: IUpdateDoctorRequest) => Promise<INoContentResponse>;
    changeStatus: (id: string, data: IChangeStatusRequest) => Promise<AxiosResponse<INoContentResponse, any>>;
}
