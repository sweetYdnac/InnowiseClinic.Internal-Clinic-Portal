import { IReceptionistsResponse } from '../response/receptionists';

export interface IReceptionistsService {
    getById: (id: string) => Promise<IReceptionistsResponse>;
}
