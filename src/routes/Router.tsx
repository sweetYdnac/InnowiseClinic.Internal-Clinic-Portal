import { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
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
import { CreatePatientPage } from '../pages/patients/CreatePatientPage';
import { PatientProfilePage } from '../pages/patients/PatientPage/PatientProfilePage';
import { PatientsPage } from '../pages/patients/PatientsPage';
import { CreateReceptionist } from '../pages/receptionists/CreateReceptionist';
import { ReceptionistProfilePage } from '../pages/receptionists/ReceptionistProfilePage';
import { ReceptionistsPage } from '../pages/receptionists/ReceptionistsPage';
import { CreateSpecializationPage } from '../pages/specializations/CreateSpecializationPage';
import { SpecializationInformationPage } from '../pages/specializations/SpecializationInformationPage';
import { SpecializationsPage } from '../pages/specializations/SpecializationsPage';
import { AppRoutes } from './AppRoutes';
import { ProtectedRoute } from './ProtectedRoute';
import { DoctorSchedulePage } from '../pages/doctors/DoctorSchedulePage';

interface AppRouterProps {
    children: ReactNode;
}

export const AppRouter = ({ children }: AppRouterProps) => {
    return (
        <>
            <>{children}</>
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
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist, Roles.Doctor]}>
                                <DoctorProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.DoctorSchedule}
                        element={
                            <ProtectedRoute roles={[Roles.Doctor, Roles.Admin]}>
                                <DoctorSchedulePage />
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
                    <Route
                        path={AppRoutes.Specializations}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <SpecializationsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.CreateSpecialization}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <CreateSpecializationPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.SpecializationInformation}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <SpecializationInformationPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.Patients}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <PatientsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.CreatePatient}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <CreatePatientPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.PatientProfile}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <PatientProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.Receptionists}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <ReceptionistsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.CreateReceptionist}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <CreateReceptionist />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.ReceptionistProfile}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <ReceptionistProfilePage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </>
    );
};
