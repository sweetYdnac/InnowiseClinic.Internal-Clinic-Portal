import { ReactNode } from 'react';

export interface ReadonlyTextfieldProps {
    displayName: string;
    value: string | number;
    inputMode?: 'text' | 'numeric';
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}
