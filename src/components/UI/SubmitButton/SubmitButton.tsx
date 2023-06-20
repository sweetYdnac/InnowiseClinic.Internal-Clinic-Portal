import { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { SubmitButtonProps } from './SubmitButton.interface';
import { StyledSubmitButton } from './SubmitButton.styles';

export const SubmitButton = <T extends FieldValues>({ errors, shouldBeTouched, children }: SubmitButtonProps<T>) => {
    const disabled = useMemo(
        () => Object.keys(errors).some((key) => errors[key]?.message) || shouldBeTouched?.some((field) => !field),
        [errors, shouldBeTouched]
    );

    return (
        <StyledSubmitButton type='submit' variant='contained' disabled={disabled}>
            {children}
        </StyledSubmitButton>
    );
};
