import { useEffect } from 'react';
import { AuthorizationService } from './api/services/AuthorizationService';
import { useAppDispatch } from './hooks/store';
import { IProfileState, setProfile } from './store/profileSlice';
import { setRole } from './store/roleSlice';
import { getProfile, getRoleByName } from './utils/functions';

export const Root = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const initializeRole = async () => {
            if (!AuthorizationService.isAuthorized()) {
                await AuthorizationService.refresh();
            }

            const role = getRoleByName(AuthorizationService.getRoleName());
            dispatch(setRole(role));

            const accountId = AuthorizationService.getAccountId();
            if (accountId) {
                const profile = await getProfile(AuthorizationService.getRoleName(), accountId);
                if (profile) {
                    dispatch(setProfile(profile as IProfileState));
                }
            }
        };

        initializeRole();
    }, []);
    return <></>;
};
