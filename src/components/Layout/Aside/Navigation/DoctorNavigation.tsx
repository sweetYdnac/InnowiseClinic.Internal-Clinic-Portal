import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Divider, List } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../../constants/AppRoutes';
import { useAppSelector } from '../../../../hooks/store';
import { selectProfile } from '../../../../store/profileSlice';
import { AsideItem } from '../AsideItem/AsideItem';

export const DoctorNavigation = () => {
    const navigate = useNavigate();
    const profile = useAppSelector(selectProfile);

    return (
        <List>
            <AsideItem displayName='Profile' handleClick={() => navigate(AppRoutes.DoctorProfile.replace(':id', `${profile.id}`))}>
                <ManageAccountsIcon />
            </AsideItem>
            <Divider variant='middle' />
            <AsideItem displayName='My schedule' handleClick={() => navigate(AppRoutes.DoctorSchedule.replace(':id', `${profile.id}`))}>
                <CalendarMonthIcon />
            </AsideItem>
        </List>
    );
};
