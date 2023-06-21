import AddCircleIcon from '@mui/icons-material/AddCircle';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupIcon from '@mui/icons-material/Group';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { AppRoutes } from '../../../../routes';
import { INavigationItemProp } from '../interfaces/INavigationItemProp';

export const ReceptionistNavigationItemsProps: INavigationItemProp[] = [
    {
        displayName: 'Create Appointment',
        route: AppRoutes.CreateAppointment,
        icon: AddCircleIcon,
    },
    {
        displayName: 'Appointments',
        route: AppRoutes.Appointments,
        icon: MonitorHeartIcon,
    },
    {
        displayName: 'Patients',
        route: AppRoutes.Patients,
        icon: GroupIcon,
    },
    {
        displayName: 'Doctors',
        route: AppRoutes.Doctors,
        icon: LocalHospitalIcon,
    },
    {
        displayName: 'Receptionists',
        route: AppRoutes.Receptionists,
        icon: EngineeringIcon,
    },
    {
        displayName: 'Specializations',
        route: AppRoutes.Specializations,
        icon: LibraryBooksIcon,
    },
    {
        displayName: 'Offices',
        route: AppRoutes.Offices,
        icon: ApartmentIcon,
    },
];
