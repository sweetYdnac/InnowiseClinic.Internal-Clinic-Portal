import { Button } from '@mui/material';
import { ReactNode } from 'react';
import { FieldErrors, FieldNamesMarkedBoolean, FieldValues } from 'react-hook-form';

interface SubmitButtonProps<T extends FieldValues> {
    errors: FieldErrors<T>;
    touchedFields: Partial<Readonly<FieldNamesMarkedBoolean<T>>>;
    defaultValues: Readonly<T> | undefined;
    children: ReactNode;
}

const SubmitButton = <T extends FieldValues>({ defaultValues, errors, touchedFields, children }: SubmitButtonProps<T>) => {
    return (
        <Button
            type='submit'
            variant='contained'
            color='success'
            disabled={
                Object.keys(errors).some((key) => (errors[key]?.message?.toString().length ?? 0) > 0) ||
                Object.keys(touchedFields).length < Object.keys(defaultValues as object).length
            }
        >
            {children}
        </Button>
    );
};

export default SubmitButton;
