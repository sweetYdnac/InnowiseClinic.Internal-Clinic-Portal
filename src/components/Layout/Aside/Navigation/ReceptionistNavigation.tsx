import AddCircleIcon from '@mui/icons-material/AddCircle';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupIcon from '@mui/icons-material/Group';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Divider, List } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../../constants/AppRoutes';
import { Roles } from '../../../../constants/Roles';
import { useAppSelector } from '../../../../hooks/store';
import { selectProfile } from '../../../../store/profileSlice';
import { selectRole } from '../../../../store/roleSlice';
import { AsideItem } from '../AsideItem/AsideItem';

export const ReceptionistNavigation = () => {
    const navigate = useNavigate();
    const profile = useAppSelector(selectProfile);
    const role = useAppSelector(selectRole);

    const handleOpenProfilePage = useCallback(() => {
        switch (role) {
            case Roles.Receptionist:
                navigate(AppRoutes.ReceptionistProfile.replace(':id', `${profile.id}`));
                break;
            default:
                break;
        }
    }, [navigate, profile, role]);

    return (
        <List>
            <AsideItem displayName='Create Appointment' handleClick={() => navigate(AppRoutes.CreateAppointment)}>
                <AddCircleIcon />
            </AsideItem>
            <Divider variant='middle' />
            <AsideItem displayName='Profile' handleClick={handleOpenProfilePage}>
                <ManageAccountsIcon />
            </AsideItem>
            <Divider variant='middle' />
            <AsideItem displayName='Appointments' handleClick={() => navigate(AppRoutes.Appointments)}>
                <MonitorHeartIcon />
            </AsideItem>
            <AsideItem displayName='Patients' handleClick={() => navigate(AppRoutes.Patients)}>
                <GroupIcon />
            </AsideItem>
            <AsideItem displayName='Doctors' handleClick={() => navigate(AppRoutes.Doctors)}>
                <LocalHospitalIcon />
            </AsideItem>
            <AsideItem displayName='Receptionists' handleClick={() => navigate(AppRoutes.Receptionists)}>
                <EngineeringIcon />
            </AsideItem>
            <AsideItem displayName='Specializations' handleClick={() => navigate(AppRoutes.Specializations)}>
                <LibraryBooksIcon />
            </AsideItem>
            <AsideItem displayName='Offices' handleClick={() => navigate(AppRoutes.Offices)}>
                <ApartmentIcon />
            </AsideItem>
        </List>
    );
};
