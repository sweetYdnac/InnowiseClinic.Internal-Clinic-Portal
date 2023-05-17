import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutes } from '../constants/AppRoutes';
import { Roles } from '../constants/Roles';
import { Home } from '../pages/Home';
import { AppointmentsPage } from '../pages/appointments/AppointmentsPage';
import { CreateAppointment } from '../pages/appointments/CreateAppointment';
import { RescheduleAppointment } from '../pages/appointments/RescheduleAppointmentPage';
import { SignIn } from '../pages/authorization/SignIn';
import { CreateDoctorPage } from '../pages/doctors/CreateDoctorPage';
import { DoctorProfilePage } from '../pages/doctors/DoctorProfilePage';
import { DoctorsPage } from '../pages/doctors/DoctorsPage';
import { Layout } from '../pages/layout/Layout';
import { CreateOfficePage } from '../pages/offices/CreateOfficePage';
import { OfficeInformationPage } from '../pages/offices/OfficeInformationPage';
import { OfficesPage } from '../pages/offices/OfficesPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={AppRoutes.SignIn} element={<SignIn />} />

                <Route element={<Layout />}>
                    <Route path={AppRoutes.Home} element={<Home />} />
                    <Route
                        path={AppRoutes.Appointments}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <AppointmentsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.CreateAppointment}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <CreateAppointment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.RescheduleAppointment}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <RescheduleAppointment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.Doctors}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <DoctorsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.CreateDoctor}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <CreateDoctorPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.DoctorProfile}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <DoctorProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.Offices}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <OfficesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.CreateOffice}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <CreateOfficePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.OfficeInformation}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <OfficeInformationPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
