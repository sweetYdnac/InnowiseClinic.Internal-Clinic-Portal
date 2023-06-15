import { DateView } from '@mui/x-date-pickers';
import { Control } from 'react-hook-form';

export interface DatepickerProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    disableFuture?: boolean;
    disablePast?: boolean;
    views?: DateView[];
    openTo?: DateView;
    disabled?: boolean;
    readonly?: boolean;
    handleValueChange?: () => void;
}
