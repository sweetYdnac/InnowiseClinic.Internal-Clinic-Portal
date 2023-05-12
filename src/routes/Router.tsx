import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutes } from '../constants/AppRoutes';
import { Roles } from '../constants/Roles';
import { Home } from '../pages/Home';
import { AppointmentsPage } from '../pages/appointments/AppointmentsPage';
import { CreateAppointment } from '../pages/appointments/CreateAppointment';
import { DoctorsPage } from '../pages/doctors/DoctorsPage';
import { Layout } from '../pages/layout/Layout';
import { Login } from '../pages/login/Login';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={AppRoutes.Login} element={<Login />} />

                <Route element={<Layout />}>
                    <Route path='/' element={<Home />} />
                    <Route
                        path='/appointments'
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <AppointmentsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/appointments/create'
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <CreateAppointment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/doctors'
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <DoctorsPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
