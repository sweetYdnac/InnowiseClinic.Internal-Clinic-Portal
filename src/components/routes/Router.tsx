import { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Roles } from '../../constants/Roles';
import { Layout } from '../Layout';

import { AppRoutes } from '../../constants/AppRoutes';
import {
    AppointmentResultPage,
    AppointmentsPage,
    CreateAppointmentPage,
    CreateAppointmentResultPage,
    CreateDoctorPage,
    CreateOfficePage,
    CreatePatientPage,
    CreateReceptionistPage,
    CreateSpecializationPage,
    DoctorProfilePage,
    DoctorSchedulePage,
    DoctorsPage,
    HomePage,
    OfficeInformationPage,
    OfficesPage,
    PatientProfilePage,
    PatientsPage,
    ReceptionistProfilePage,
    ReceptionistsPage,
    RescheduleAppointmentPage,
    SignInPage,
    SpecializationInformationPage,
    SpecializationsPage,
} from '../../pages';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute';

interface AppRouterProps {
    children: ReactNode;
}

export const AppRouter = ({ children }: AppRouterProps) => {
    return (
        <>
            <>{children}</>
            <Routes>
                <Route path={AppRoutes.SignIn} element={<SignInPage />} />

                <Route element={<Layout />}>
                    <Route path={AppRoutes.Home} element={<HomePage />} />
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
                                <CreateAppointmentPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.RescheduleAppointment}
                        element={
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist]}>
                                <RescheduleAppointmentPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.AppointmentResult}
                        element={
                            <ProtectedRoute roles={[Roles.Doctor]}>
                                <AppointmentResultPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.CreateAppointmentResult}
                        element={
                            <ProtectedRoute roles={[Roles.Doctor]}>
                                <CreateAppointmentResultPage />
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
                            <ProtectedRoute roles={[Roles.Doctor]}>
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
                            <ProtectedRoute roles={[Roles.Admin, Roles.Receptionist, Roles.Doctor]}>
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
                                <CreateReceptionistPage />
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
