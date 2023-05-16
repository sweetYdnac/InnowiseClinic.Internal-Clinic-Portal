export enum ApppointmentsQueries {
    getById = 'get-appointment-by-id',
    getPaged = 'get-appointments',
    getTimeSlots = 'get-time-slots',
}

export enum OfficesQueries {
    getPaged = 'get-offices',
}

export enum ServicesQueries {
    getPaged = 'get-services',
}

export enum SpecializationsQueries {
    getById = 'get-specialization-by-id',
    getPaged = 'get-specializations',
}

export enum DoctorsQueries {
    getById = 'get-doctor-by-id',
    getPaged = 'get-doctors',
}

export enum PatientsQueries {
    getPaged = 'get-patients',
}

export enum PhotosQueries {
    getById = 'get-photo-by-id',
}

export enum AuthorizationQueries {
    signIn = 'sign-in',
    getInitialProfile = 'get-initial-profile',
}
