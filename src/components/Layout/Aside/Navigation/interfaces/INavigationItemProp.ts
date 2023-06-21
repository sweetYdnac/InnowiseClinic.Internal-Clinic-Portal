import { AppRoutes } from '../../../../routes';

export interface INavigationItemProp {
    displayName: string;
    route: AppRoutes;
    icon: React.ElementType;
}
