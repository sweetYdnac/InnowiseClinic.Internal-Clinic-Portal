import { ReactNode } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

export interface SubmitButtonProps<T extends FieldValues> {
    errors: FieldErrors<T>;
    children: ReactNode;
    shouldBeTouched?: (boolean | undefined)[];
}
