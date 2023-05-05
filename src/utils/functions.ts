import { AlertColor } from '@mui/material';
import DoctorsService from '../api/services/DoctorsService';
import ReceptionistsService from '../api/services/ReceptionistsService';
import { PopupData } from '../components/Popup/Popup';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import { IProfileState } from '../store/profileSlice';
import { Roles } from '../types/enums/Roles';

export const getQueryString = (data: { [key: string]: any }) => {
    const params = [];
    for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
            value.forEach((val, index) => {
                params.push(`${key}[${index}]=${encodeURIComponent(val)}`);
            });
        } else if (value === null) {
            params.push(`${key}=`);
        } else {
            params.push(`${key}=${encodeURIComponent(value)}`);
        }
    }
    return params.join('&');
};

export const getRoleByName = (title: string) =>
    Object.values(Roles).find((role) => role.toLowerCase() === title.toLowerCase()) ?? Roles.None;

export const getProfile = async (roleName: string, accountId: string) => {
    switch (getRoleByName(roleName)) {
        case Roles.Doctor:
            const doctor = await DoctorsService.getById(accountId);
            return {
                id: accountId,
                photoId: doctor.photoId,
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                middleName: doctor.middleName,
                officeAddress: doctor.officeAddress,
                dateOfBirth: doctor.dateOfBirth,
                specializationName: doctor.specializationName,
                status: doctor.status,
            } as IProfileState;
        case Roles.Receptionist:
            const receptionist = await ReceptionistsService.getById(accountId);
            return {
                id: accountId,
                photoId: receptionist.photoId,
                firstName: receptionist.firstName,
                lastName: receptionist.lastName,
                middleName: receptionist.middleName,
                officeAddress: receptionist.officeAddress,
            } as IProfileState;
        default:
            console.log('invalid role');
            break;
    }
};

export const showPopup = (message: string, color?: AlertColor) => {
    eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
        message: message,
        color: color,
    } as PopupData);
};
