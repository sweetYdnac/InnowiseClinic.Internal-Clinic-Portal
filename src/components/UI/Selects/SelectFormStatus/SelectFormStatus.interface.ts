import { Control } from 'react-hook-form';

export interface SelectFormStatusProps {
    id: string;
    control: Control<any, any>;
    readonly?: boolean;
}
