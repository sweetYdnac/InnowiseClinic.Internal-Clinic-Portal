import { Roles } from '../../../../../constants/Roles';
import { AppRoutes } from '../../../../routes';

export interface IProfileNavigationItemProp {
    role: Roles;
    route: AppRoutes;
}
