import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizationService from '../../api/services/AuthorizationService';
import { useAppDispatch } from '../../hooks/store';
import { switchAside } from '../../store/layoutSlice';
import { defaultProfile, setProfile } from '../../store/profileSlice';
import { defaultRole, setRole } from '../../store/roleSlice';
import { AppRoutes } from '../../types/enums/AppRoutes';

interface HeaderProps {
    isAuthorized: boolean;
}

const Header: FunctionComponent<HeaderProps> = ({ isAuthorized }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLoginClick = () => {
        if (isAuthorized) {
            AuthorizationService.logout();
            dispatch(setProfile(defaultProfile));
            dispatch(setRole(defaultRole));
        } else {
            navigate(AppRoutes.Login);
        }
    };

    return (
        <AppBar
            sx={{
                '&.MuiAppBar-root': {
                    position: 'inherit',
                },
            }}
        >
            <Toolbar>
                {isAuthorized && (
                    <IconButton
                        color='inherit'
                        edge='start'
                        onClick={() => dispatch(switchAside())}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Button onClick={() => navigate(AppRoutes.Home)} color='inherit'>
                    Innowise Clinic
                </Button>

                <Button onClick={handleLoginClick} color='inherit' sx={{ marginLeft: 'auto' }}>
                    {isAuthorized ? 'Logout' : 'Login'}
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
