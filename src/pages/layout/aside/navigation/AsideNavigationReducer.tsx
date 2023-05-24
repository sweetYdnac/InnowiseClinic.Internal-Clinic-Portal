import { Roles } from '../../../../constants/Roles';
import { useAppSelector } from '../../../../hooks/store';
import { selectRole } from '../../../../store/roleSlice';
import { DoctorNavigation } from './DoctorNavigation';
import { ReceptionistNavigation } from './ReceptionistNavigation';

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
