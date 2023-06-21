import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Roles } from '../../../../../constants/Roles';
import { AppRoutes } from '../../../../routes';
import { IProfileNavigationDefaults as IProfileNavigationDefaultsProps } from '../interfaces/IProfileNavigationDefaultsProps';
import { IProfileNavigationItemProp } from '../interfaces/IProfileNavigationItemProp';

export const ProfileNavigationDefaults: IProfileNavigationDefaultsProps = {
    displayName: 'Profile',
    icon: ManageAccountsIcon,
};

export const ProfileNavigationProps: IProfileNavigationItemProp[] = [
    {
        role: Roles.Receptionist,
        route: AppRoutes.ReceptionistProfile,
    },
    {
        role: Roles.Doctor,
        route: AppRoutes.DoctorProfile,
    },
];
