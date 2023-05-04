import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Appointments from '../pages/appointments/Appointments';
import Layout from '../pages/layout/Layout';
import Login from '../pages/login/Login';
import { AppRoutes } from '../types/enums/AppRoutes';
import { Roles } from '../types/enums/Roles';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={AppRoutes.Login} element={<Login />} />

                <Route element={<Layout />}>
                    <Route path='/' element={<Home />} />
                    <Route
                        path='appointments'
                        element={
                            <ProtectedRoute roles={[Roles.Receptionist]}>
                                <Appointments />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
