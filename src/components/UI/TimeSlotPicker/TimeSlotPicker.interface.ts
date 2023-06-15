import { Control } from 'react-hook-form';
import { ITimeSlot } from '../../../types/response/appointments';

export interface TimeSlotPickerProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    timeSlots: ITimeSlot[];
    handleOpen: () => void;
    disabled: boolean;
    isLoading: boolean;
}
