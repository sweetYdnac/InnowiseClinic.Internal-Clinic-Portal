import { Modals } from '../constants/Modals';
import { WorkMode } from '../constants/WorkModes';
import { useAppSelector } from '../hooks/store';
import { CreateServiceModal } from '../pages/services/CreateServiceModal';
import { ServiceModal } from '../pages/services/ServiceModal';
import { selectModal } from '../store/modalsSlice';

const ModalsReducer = () => {
    const modal = useAppSelector(selectModal);

    switch (modal.name) {
        case Modals.None:
            return <></>;
        case Modals.Service:
            return <ServiceModal id={modal.id as string} initialWorkMode={modal.workMode as WorkMode} />;
        case Modals.CreateService:
            return <CreateServiceModal />;
        default:
            return <></>;
    }
};

export default ModalsReducer;
