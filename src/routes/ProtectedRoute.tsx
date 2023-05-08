import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizationService from '../api/services/AuthorizationService';
import Loader from '../components/Loader/Loader';
import { useAppSelector } from '../hooks/store';
import { selectRole } from '../store/roleSlice';
import { AppRoutes } from '../constants/AppRoutes';
import { Roles } from '../types/enums/Roles';
import { showPopup } from '../utils/functions';

interface ProtectedRouteProps {
    roles: Roles[];
    children: ReactNode;
}

const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
    const [display, setDisplay] = useState(false);
    const currentRole = useAppSelector(selectRole);
    const navigate = useNavigate();

    useEffect(() => {
        const refresh = async () => {
            await AuthorizationService.refresh(undefined, navigate).then(() => {
                setDisplay(true);
            });
        };

        const checkAuthorization = async () => {
            if (!roles.find((item) => item === currentRole)) {
                navigate(AppRoutes.Home);
                showPopup(`Only users with roles ${roles.map((role) => role.toUpperCase()).join(', ')} allowed to access this page.`);
            }

            if (AuthorizationService.isAuthorized()) {
                setDisplay(true);
            } else {
                refresh();
            }
        };

        checkAuthorization();
    }, []);

    return <>{display ? children : <Loader />}</>;
};

export default ProtectedRoute;
