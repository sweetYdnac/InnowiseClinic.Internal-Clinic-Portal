import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AuthorizationService from '../../api/services/AuthorizationService';
import Popup from '../../components/Popup/Popup';
import Header from './Header';
import Aside from './aside/Aside';

const Layout = () => {
    const [isAuthorized, setIsAuthorized] = useState(AuthorizationService.isAuthorized());

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthorized(AuthorizationService.isAuthorized());
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Header isAuthorized={isAuthorized} />
            <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                {isAuthorized && <Aside />}
                <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>

            <Popup />
        </Box>
    );
};

export default Layout;
