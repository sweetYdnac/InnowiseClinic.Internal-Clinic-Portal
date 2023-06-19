import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { FunctionComponent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../constants/AppRoutes';
import { useAuthorizationService } from '../../../hooks/services/useAuthorizationService';
import { useAppDispatch } from '../../../hooks/store';
import { switchAside } from '../../../store/layoutSlice';
import { defaultProfile, setProfile } from '../../../store/profileSlice';
import { defaultRole, setRole } from '../../../store/roleSlice';
import { HeaderProps } from './Header.interface';
import { AsideButton, HomeButton, LoginButton, StyledAppBar } from './Header.styles';

export const Header: FunctionComponent<HeaderProps> = ({ isAuthorized }) => {
    const authorizationService = useAuthorizationService();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSwitchAside = useCallback(() => dispatch(switchAside()), [dispatch]);
    const handleHomeClick = useCallback(() => navigate(AppRoutes.Home), [navigate]);
    const handleLoginClick = useCallback(() => {
        if (isAuthorized) {
            authorizationService.logout();
            dispatch(setProfile(defaultProfile));
            dispatch(setRole(defaultRole));
        } else {
            navigate(AppRoutes.SignIn);
        }
    }, [authorizationService, dispatch, isAuthorized, navigate]);

    return (
        <StyledAppBar>
            <Toolbar>
                {isAuthorized && (
                    <AsideButton onClick={handleSwitchAside}>
                        <MenuIcon />
                    </AsideButton>
                )}

                <HomeButton onClick={handleHomeClick}>Innowise Clinic</HomeButton>
                <LoginButton onClick={handleLoginClick}>{isAuthorized ? 'Logout' : 'Login'}</LoginButton>
            </Toolbar>
        </StyledAppBar>
    );
};
