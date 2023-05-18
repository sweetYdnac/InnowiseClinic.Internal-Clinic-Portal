import { useEffect } from 'react';
import { Loader } from './components/Loader/Loader';
import { useInitialProfileQuery } from './hooks/requests/authorization';
import { useAuthorizationService } from './hooks/services/useAuthorizationService';
import { useAppDispatch } from './hooks/store';
import { setRole } from './store/roleSlice';
import { getRoleByName } from './utils/functions';

export const Root = () => {
    const authorizationService = useAuthorizationService();
    const { isFetching, refetch } = useInitialProfileQuery();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initializeRole = async () => {
            if (!authorizationService.isAuthorized()) {
                await authorizationService.refresh();
            }

            const role = getRoleByName(authorizationService.getRoleName());
            dispatch(setRole(role));

            const accountId = authorizationService.getAccountId();
            if (accountId) {
                refetch();
            }
        };

        initializeRole();
    }, []);

    return isFetching ? <Loader /> : <></>;
};
