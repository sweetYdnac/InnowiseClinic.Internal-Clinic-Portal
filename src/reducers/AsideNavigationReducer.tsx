import { DoctorNavigation } from '../components/Layout/Aside/Navigation/DoctorNavigation';
import { ReceptionistNavigation } from '../components/Layout/Aside/Navigation/ReceptionistNavigation';
import { Roles } from '../constants/Roles';
import { useAppSelector } from '../hooks/store';
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
