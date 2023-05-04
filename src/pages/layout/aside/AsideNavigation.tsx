import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Divider, List } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AsideItem from './AsideItem';

const AsideNavigation = () => {
    const navigate = useNavigate();

    return (
        <>
            <List>
                <AsideItem displayName='Profile' handleClick={() => navigate('/profile')}>
                    <ManageAccountsIcon />
                </AsideItem>
                <Divider variant='middle' />
                <AsideItem displayName='Appointments' handleClick={() => navigate('/appointments')}>
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

export default AsideNavigation;
