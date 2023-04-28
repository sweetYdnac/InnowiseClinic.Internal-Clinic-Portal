export interface IRegisterRequest {
    email: string;
    password: string;
}

export interface ILoginRequest extends IRegisterRequest {}
