import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AppRoutes } from '../../../../routes';
import { INavigationItemProp } from '../interfaces/INavigationItemProp';

export const DoctorNavigationItemsProps: INavigationItemProp[] = [
    {
        displayName: 'My schedule',
        route: AppRoutes.DoctorSchedule,
        icon: CalendarMonthIcon,
    },
];
