import { ReactNode } from 'react';
import { Control } from 'react-hook-form';
import { WorkMode } from '../../../constants/WorkModes';

export interface TextfieldProps {
    id: string;
    control: Control<any, any>;
    displayName: string;
    disableWhiteSpace?: boolean;
    inputMode?: 'text' | 'numeric' | 'email';
    workMode?: WorkMode;
    placeholder?: string;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}
