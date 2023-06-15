import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthorizationService } from '../../hooks/services/useAuthorizationService';
import { ModalsReducer } from '../../reducers/ModalsReducer';
import { Aside } from './Aside/Aside';
import { Header } from './Header/Header';

export const Layout = () => {
    const authorizationService = useAuthorizationService();
    const [isAuthorized, setIsAuthorized] = useState(authorizationService.isAuthorized());

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthorized(authorizationService.isAuthorized());
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [authorizationService]);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Header isAuthorized={isAuthorized} />
            <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                {isAuthorized && <Aside />}
                <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                    <ModalsReducer />
                </Box>
            </Box>
        </Box>
    );
};
