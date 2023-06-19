import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthorizationService } from '../../hooks/services/useAuthorizationService';
import { ModalsReducer } from '../../reducers/ModalsReducer';
import { Aside } from './Aside/Aside';
import { Header } from './Header/Header';
import { StyledBody, StyledContent, StyledOutlet } from './Layout.styles';

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
        <StyledContent>
            <Header isAuthorized={isAuthorized} />
            <StyledBody>
                {isAuthorized && <Aside />}
                <StyledOutlet component='main'>
                    <Outlet />
                    <ModalsReducer />
                </StyledOutlet>
            </StyledBody>
        </StyledContent>
    );
};
