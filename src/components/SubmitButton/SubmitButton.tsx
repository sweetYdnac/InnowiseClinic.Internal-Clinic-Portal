import { Button } from '@mui/material';
import { ReactNode } from 'react';
import { FieldErrors, FieldNamesMarkedBoolean, FieldValues } from 'react-hook-form';

interface SubmitButtonProps<T extends FieldValues> {
    errors: FieldErrors<T>;
    touchedFields: Partial<Readonly<FieldNamesMarkedBoolean<T>>>;
    shouldBeTouched: (boolean | undefined)[];
    children: ReactNode;
}

export const SubmitButton = <T extends FieldValues>({ errors, touchedFields, shouldBeTouched, children }: SubmitButtonProps<T>) => {
    return (
        <Button
            type='submit'
            variant='contained'
            color='success'
            disabled={
                Object.keys(errors).some((key) => errors[key]?.message) || shouldBeTouched.some((field) => field === (false || undefined))
            }
        >
            {children}
        </Button>
    );
};
