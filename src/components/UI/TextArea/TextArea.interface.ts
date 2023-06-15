import { Control } from 'react-hook-form';

export interface TextAreaProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    readonly?: boolean;
}
