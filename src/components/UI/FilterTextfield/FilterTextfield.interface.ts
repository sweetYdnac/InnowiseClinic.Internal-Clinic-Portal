import { ReactNode } from 'react';
import { Control } from 'react-hook-form';

export interface FilterTextfieldProps {
    valueFieldName: string;
    inputFieldName: string;
    control: Control<any, any>;
    displayName: string;
    debounceDelay?: number;
    inputMode?: 'text' | 'numeric';
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}
