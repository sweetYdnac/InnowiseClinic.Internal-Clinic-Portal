import { ReactNode, useEffect } from 'react';
import { Loader } from '../components/Loader/Loader';
import { useInitialProfileQuery } from '../hooks/requests/authorization';
import { useAuthorizationService } from '../hooks/services/useAuthorizationService';
import { useAppDispatch } from '../hooks/store';
import { setRole } from '../store/roleSlice';
import { getRoleByName } from '../utils/functions';

interface RootProps {
    children: ReactNode;
}

export const Root = ({ children }: RootProps) => {
    const { isFetching, refetch } = useInitialProfileQuery();
    const authorizationService = useAuthorizationService();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initializeStore = async () => {
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

        initializeStore();
    }, []);

    return isFetching ? <Loader /> : <>{children}</>;
};
