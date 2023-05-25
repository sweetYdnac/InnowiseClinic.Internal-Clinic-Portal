import { Roles } from '../constants/Roles';
import { useAppSelector } from '../hooks/store';
import { DoctorNavigation } from '../pages/layout/aside/navigation/DoctorNavigation';
import { ReceptionistNavigation } from '../pages/layout/aside/navigation/ReceptionistNavigation';
import { selectRole } from '../store/roleSlice';

export const AsideNavigationReducer = () => {
    const role = useAppSelector(selectRole);

    switch (role) {
        case Roles.Admin:
        case Roles.Receptionist:
            return <ReceptionistNavigation />;
        case Roles.Doctor:
            return <DoctorNavigation />;
        default:
            return <></>;
    }
};
