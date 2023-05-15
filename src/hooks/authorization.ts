import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import randomize from 'randomatic';
import { useNavigate } from 'react-router-dom';
import { ValidationError } from 'yup';
import { AuthorizationService } from '../api/services/AuthorizationService';
import { AppRoutes } from '../constants/AppRoutes';
import { PasswordBoundaries } from '../constants/Validation';
import { ICreatedResponse } from '../types/common/Responses';
import { IRegisterRequest } from '../types/request/authorization';
import { showPopup } from '../utils/functions';
import { useSignUpValidator } from './validators/authorization/signUp';

export const useCreateAccountCommand = (email: string) => {
    const navigate = useNavigate();
    const { validationScheme } = useSignUpValidator();

    return useMutation<ICreatedResponse | void, AxiosError<any, any>, void>({
        mutationFn: async () => {
            try {
                const request: IRegisterRequest = {
                    email: email,
                    password: randomize(
                        'Aa0',
                        Math.floor(Math.random() * (PasswordBoundaries.max - PasswordBoundaries.min + 1) + PasswordBoundaries.min)
                    ),
                };

                await validationScheme.validate(request);

                return await AuthorizationService.signUp(request);
            } catch (error) {
                if (error instanceof ValidationError) {
                    navigate(AppRoutes.Home);
                    showPopup('Something went wrong.');
                }
            }
        },
        onError: (error) => {
            if (error.response?.status === 400) {
                navigate(AppRoutes.Home);
                showPopup('Something went wrong.');
            }
        },
    });
};
