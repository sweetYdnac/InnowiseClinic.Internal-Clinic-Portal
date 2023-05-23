export enum AppRoutes {
    Home = '/',
    SignIn = '/signIn',

    Appointments = '/appointments',
    CreateAppointment = '/appointments/create',
    RescheduleAppointment = '/appointments/:id/reschedule',

    AppointmentResult = '/appointments/results/:id',

    Doctors = '/doctors',
    CreateDoctor = '/doctors/create',
    DoctorProfile = '/doctors/:id',

    Patients = '/patients',
    CreatePatient = '/patients/create',
    PatientProfile = '/patients/:id',

    Receptionists = '/receptionists',
    CreateReceptionist = '/receptionists/create',
    ReceptionistProfile = '/receptionists/:id',

    Offices = '/offices',
    CreateOffice = '/offices/create',
    OfficeInformation = '/offices/:id',

    Specializations = '/specializations',
    CreateSpecialization = '/specializations/create',
    SpecializationInformation = '/specializations/:id',

    ServiceInformation = '/services/:id',
}
