import { useSnackbar } from 'notistack';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader/Loader';
import { Roles } from '../constants/Roles';
import { useAuthorizationService } from '../hooks/services/useAuthorizationService';
import { useAppSelector } from '../hooks/store';
import { selectRole } from '../store/roleSlice';
import { AppRoutes } from './AppRoutes';

interface ProtectedRouteProps {
    roles: Roles[];
    children: ReactNode | ReactNode[];
}

export const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
    const authorizationService = useAuthorizationService();
    const [display, setDisplay] = useState(false);
    const currentRole = useAppSelector(selectRole);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const refresh = async () => {
            await authorizationService.refresh().then(() => {
                setDisplay(true);
            });
        };

        const checkAuthorization = async () => {
            if (currentRole === Roles.None) {
                return;
            }

            if (!roles.find((item) => item === currentRole)) {
                navigate(AppRoutes.Home);
                enqueueSnackbar(
                    `Only users with roles ${roles.map((role) => role.toUpperCase()).join(', ')} allowed to access this page.`,
                    {
                        variant: 'warning',
                    }
                );
            }

            if (authorizationService.isAuthorized()) {
                setDisplay(true);
            } else {
                refresh();
            }
        };

        checkAuthorization();
    }, [authorizationService, currentRole, enqueueSnackbar, navigate, roles]);

    return <>{display ? children : <Loader />}</>;
};
