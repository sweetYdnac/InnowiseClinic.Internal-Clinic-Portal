import { ReactNode } from 'react';
import { Roles } from '../../../constants/Roles';

export interface ProtectedRouteProps {
    roles: Roles[];
    children: ReactNode | ReactNode[];
}
