export type uuid = string;
export type email = string;
export type typeName = 'name' | 'username' | 'firstName' | 'lastName';
export type validationFunction = () => IValidationResponse;


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