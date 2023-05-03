import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizationService from '../../api/services/AuthorizationService';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';

export enum LoginMessage {
    LOGIN = 'Login',
    LOGOUT = 'Logout',
}

interface HeaderProps {
    isAuthorized: boolean;
}

const Header: FunctionComponent<HeaderProps> = ({ isAuthorized }) => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const switchLoginModal = () => {
            setIsLoginModalOpen(!isLoginModalOpen);
        };

        eventEmitter.addListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`, switchLoginModal);

        return () => {
            eventEmitter.removeListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`, switchLoginModal);
        };
    }, [isLoginModalOpen, setIsLoginModalOpen, isAuthorized]);

    const handleLogin = () => {
        isAuthorized ? AuthorizationService.logout() : setIsLoginModalOpen(true);
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
                    {isAuthorized && (
                        <IconButton color='inherit' edge='start' onClick={handleAsideToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Button onClick={() => navigate('/')} color='inherit'>
                        Innowise Clinic
                    </Button>

                    <Button onClick={() => handleLogin()} color='inherit' sx={{ marginLeft: 'auto' }}>
                        {isAuthorized ? LoginMessage.LOGOUT : LoginMessage.LOGIN}
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
