import { Divider, List } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Roles } from '../../../../constants/Roles';
import { useAppSelector } from '../../../../hooks/store';
import { selectProfile } from '../../../../store/profileSlice';
import { selectRole } from '../../../../store/roleSlice';
import { AppRoutes } from '../../../routes';
import { AsideItem } from '../AsideItem/AsideItem';
import { DoctorNavigationItemsProps } from './data/doctorNavigationItemsProps';
import { ProfileNavigationProps, ProfileNavigationDefaults as profileNavigationDefaults } from './data/profileNavigationProps';
import { ReceptionistNavigationItemsProps } from './data/receptionistNavigationItemsProps';

export const Navigation = () => {
    const navigate = useNavigate();
    const profile = useAppSelector(selectProfile);
    const role = useAppSelector(selectRole);

    const profileProps = useMemo(() => ProfileNavigationProps.find((item) => item.role === role), [role]);
    const roleProps = useMemo(() => {
        switch (role) {
            case Roles.Doctor:
                return DoctorNavigationItemsProps;
            case Roles.Receptionist:
                return ReceptionistNavigationItemsProps;
            default:
                break;
        }
    }, [role]);

    const routeTo = useCallback(
        (route: string | undefined) => () => navigate(route?.replace(':id', `${profile.id}`) ?? AppRoutes.Home),
        [navigate, profile.id]
    );

    return (
        <List>
            <AsideItem displayName={profileNavigationDefaults.displayName} handleClick={routeTo(profileProps?.route)}>
                <profileNavigationDefaults.icon />
            </AsideItem>

            <Divider variant='middle' />

            {roleProps &&
                roleProps.map((item) => {
                    return (
                        <AsideItem key={item.displayName} displayName={item.displayName} handleClick={routeTo(item.route)}>
                            <item.icon />
                        </AsideItem>
                    );
                })}
        </List>
    );
};
