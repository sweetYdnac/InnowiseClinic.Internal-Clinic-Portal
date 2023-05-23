import { Button } from '@mui/material';
import { ReactNode } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

interface SubmitButtonProps<T extends FieldValues> {
    errors: FieldErrors<T>;
    children: ReactNode;
    shouldBeTouched?: (boolean | undefined)[];
}

export const SubmitButton = <T extends FieldValues>({ errors, shouldBeTouched, children }: SubmitButtonProps<T>) => {
    return (
        <Button
            type='submit'
            variant='contained'
            color='success'
            disabled={
                Object.keys(errors).some((key) => errors[key]?.message) || shouldBeTouched?.some((field) => field === (false || undefined))
            }
        >
            {children}
        </Button>
    );
};
