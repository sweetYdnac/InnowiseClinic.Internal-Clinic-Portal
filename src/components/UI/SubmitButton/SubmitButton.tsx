import { Button } from '@mui/material';
import { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { SubmitButtonProps } from './SubmitButton.interface';

export const SubmitButton = <T extends FieldValues>({ errors, shouldBeTouched, children }: SubmitButtonProps<T>) => {
    const disabled = useMemo(
        () => Object.keys(errors).some((key) => errors[key]?.message) || shouldBeTouched?.some((field) => !field),
        [errors, shouldBeTouched]
    );

    return (
        <Button type='submit' variant='contained' color='success' disabled={disabled}>
            {children}
        </Button>
    );
};
