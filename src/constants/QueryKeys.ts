export enum ApppointmentsQueries {
    getById = 'get-appointment-by-id',
    getPaged = 'get-appointments',
    getTimeSlots = 'get-time-slots',
    getPatientHistory = 'get-patient-history',
}

export enum OfficesQueries {
    getById = 'get-office-by-id',
    getPaged = 'get-offices',
}

export enum ServicesQueries {
    getById = 'get-service-by-id',
    getPaged = 'get-services',
}

export enum SpecializationsQueries {
    getById = 'get-specialization-by-id',
    getPaged = 'get-specializations',
}

export enum ServiceCategoriesQueries {
    getById = 'get-service-category-by-id',
    getAll = 'get-all-service-categories',
}

export enum DoctorsQueries {
    getById = 'get-doctor-by-id',
    getPaged = 'get-doctors',
}

export enum PatientsQueries {
    getById = 'get-patient-by-id',
    getPaged = 'get-patients',
}

export enum ReceptionistsQueries {
    getById = 'get-receptionist-by-id',
    getPaged = 'get-receptionists',
}

export enum PhotosQueries {
    getById = 'get-photo-by-id',
}

export enum AuthorizationQueries {
    signIn = 'sign-in',
    getInitialProfile = 'get-initial-profile',
}
