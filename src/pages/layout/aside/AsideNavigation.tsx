import AddCircleIcon from '@mui/icons-material/AddCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Divider, List } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../constants/AppRoutes';
import { AsideItem } from './AsideItem';

export const AsideNavigation = () => {
    const navigate = useNavigate();

    return (
        <>
            <List>
                <AsideItem displayName='Create Appointment' handleClick={() => navigate(AppRoutes.CreateAppointment)}>
                    <AddCircleIcon />
                </AsideItem>
                <Divider variant='middle' />
                <AsideItem displayName='Profile' handleClick={() => navigate(AppRoutes.Profile)}>
                    <ManageAccountsIcon />
                </AsideItem>
                <Divider variant='middle' />
                <AsideItem displayName='Appointments' handleClick={() => navigate(AppRoutes.Appointments)}>
                    <MonitorHeartIcon />
                </AsideItem>
                {/* <AsideItem displayName='Doctors' handleClick={() => navigate('/doctors')}>
                    <MonitorHeartIcon />
                </AsideItem>
                <AsideItem displayName='Services' handleClick={() => navigate('/services')}>
                    <MedicalServicesIcon />
                </AsideItem> */}
            </List>
        </>
    );
};
