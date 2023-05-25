export interface IJwtToken {
    nbf: number;
    exp: number;
    iss: string;
    aud: string;
    client_id: string;
    sub: string;
    auth_time: number;
    idp: string;
    role: string;
    name: string;
    jti: string;
    iat: number;
    scope: string[];
    amr: string[];
}
