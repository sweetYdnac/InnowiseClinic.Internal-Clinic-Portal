import { IPagedRequest } from '../../types/common/Requests';

export const getPagedServicesPagingDefaults: IPagedRequest = {
    currentPage: 1,
    pageSize: 20,
};
