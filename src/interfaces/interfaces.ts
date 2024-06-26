
export type uuid = string;
export type email = string;
export type typeName = 'name' | 'username' | 'firstName' | 'lastName' | 'team name';
export type validationFunction = () => IValidationResponse;
export type jwt = string;

// interfaces de entidades
export interface IUser {
    id: uuid, 
    username: string, 
    email: email, 
    firstName: string,
    lastName: string, 
    password: string, 
    squad: uuid, 
    isAdmin: boolean
}

export interface IUserDatabase {
    id?: uuid, 
    username: string, 
    email: email, 
    first_name: string,
    last_name: string, 
    password: string, 
    squad?: uuid, 
    is_admin?: boolean
}

export interface ITeam {
    id: uuid,
    name: string,
    leader: uuid
}

// interfaces de respostas
export interface IValidationResponse {
    isValid: boolean;
    message: string | null;
}

export interface IAPIResponse<T> {
    success: boolean;
    data: T | null;
    error: null | string;
    messages?: Array<string> | string
}

export interface ILoginTokenPayload {
    userID: uuid,
    isAdmin: boolean,
    squad?: uuid | null
}

export interface ICookieOptions {
    name: string,
    val: jwt, 
    options: {
        maxAge: number, 
        httpOnly: true,
        sameSite: 'strict',
        secure: true
    }
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: ILoginTokenPayload;
    }
}