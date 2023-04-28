import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizationService from '../../api/services/AuthorizationService';
import { EventType } from '../../store/eventTypes';
import { eventEmitter } from '../../store/events';

export enum LoginMessage {
    LOGIN = 'Login',
    LOGOUT = 'Logout',
}

const Header: FunctionComponent = () => {
    const [isAuthorizated, setIsAuthorized] = useState(AuthorizationService.isAuthorized());
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState<LoginMessage>(isAuthorizated ? LoginMessage.LOGOUT : LoginMessage.LOGIN);
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthorized(AuthorizationService.isAuthorized());
            setLoginMessage(AuthorizationService.isAuthorized() ? LoginMessage.LOGOUT : LoginMessage.LOGIN);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const switchLoginModal = () => {
            setIsLoginModalOpen(!isLoginModalOpen);
        };

        eventEmitter.addListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`, switchLoginModal);

        return () => {
            eventEmitter.removeListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`, switchLoginModal);
        };
    }, [isLoginModalOpen, setIsLoginModalOpen, isAuthorizated]);

    const handleLogin = () => {
        isAuthorizated ? AuthorizationService.logout() : setIsLoginModalOpen(true);
    };

    const handleAsideToggle = () => {
        eventEmitter.emit(EventType.SWITCH_ASIDE);
    };

    return (
        <>
            <AppBar
                sx={{
                    '&.MuiAppBar-root': {
                        position: 'inherit',
                    },
                }}
            >
                <Toolbar>
                    {isAuthorizated && (
                        <IconButton color='inherit' edge='start' onClick={handleAsideToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Button onClick={() => navigate('/')} color='inherit'>
                        Innowise Clinic
                    </Button>

                    <Button onClick={() => handleLogin()} color='inherit' sx={{ marginLeft: 'auto' }}>
                        {loginMessage}
                    </Button>
                </Toolbar>
            </AppBar>

            {/* {isLoginModalOpen && (
                <CustomizedModal isOpen={isLoginModalOpen} name={LoginMessage.LOGIN}>
                    <Login />
                </CustomizedModal>
            )} */}
        </>
    );
};

export default Header;
