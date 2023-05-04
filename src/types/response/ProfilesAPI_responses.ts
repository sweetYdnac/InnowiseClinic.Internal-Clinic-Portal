interface IProfile {
    photoId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    officeId: string;
    officeAddress: string;
}

export interface IDoctorResponse extends IProfile {
    dateOfBirth: string;
    specializationName: string;
    careerStartYear: number;
    status: number;
}

export interface IReceptionistsResponse extends IProfile {}
