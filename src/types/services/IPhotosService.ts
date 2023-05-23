import { ICreatedResponse, INoContentResponse } from '../common/Responses';

export interface IPhotosService {
    getById: (id: string) => Promise<string>;
    create: (photo: string) => Promise<ICreatedResponse>;
    update: (id: string, photo: string) => Promise<INoContentResponse>;
}
