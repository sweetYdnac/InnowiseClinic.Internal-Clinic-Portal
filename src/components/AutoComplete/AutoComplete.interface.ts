import { Control } from 'react-hook-form';
import { IAutoCompleteItem } from '../../types/common/Autocomplete';

export interface AutoCompleteProps {
    valueFieldName: string;
    control: Control<any, any>;
    displayName: string;
    options: IAutoCompleteItem[];
    isFetching: boolean;
    handleOpen: () => void;
    handleInputChange?: () => void;
    disabled?: boolean;
    readonly?: boolean;
    inputFieldName?: string;
    debounceDelay?: number;
}
