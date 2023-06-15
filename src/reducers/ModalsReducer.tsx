import { Modals } from '../constants/Modals';
import { WorkMode } from '../constants/WorkModes';
import { useAppSelector } from '../hooks/store';
import { CreateServiceModal } from '../components/ServicesTable/CreateServiceModal/CreateServiceModal';
import { ServiceDetailsModal } from '../components/ServicesTable/ServiceDetailsModal/ServiceDetailsModal';
import { selectModal } from '../store/modalsSlice';

export const ModalsReducer = () => {
    const modal = useAppSelector(selectModal);

    switch (modal.name) {
        case Modals.None:
            return <></>;
        case Modals.Service:
            return <ServiceDetailsModal id={modal.id as string} initialWorkMode={modal.workMode as WorkMode} />;
        case Modals.CreateService:
            return <CreateServiceModal />;
        default:
            return <></>;
    }
};
