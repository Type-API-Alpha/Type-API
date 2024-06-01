
export class InvalidDataError extends Error {
    
    code: number;
    layer: string;
    errorMessage: string;
    messages?: Array<string>

    constructor(layer:string, messages?: Array<string>) {
        super();
        this.name = this.constructor.name;
        this.errorMessage = 'Invalid data';
        this.messages = messages;
        this.code = 400;
        this.layer = layer
    } 
}


export class ConflictError extends Error {
    
    code: number;
    layer: string;

    constructor(layer:string, errorMessage: string) {
        super();
        this.name = this.constructor.name;
        this.message = errorMessage;
        this.code = 409;
        this.layer = layer
    } 
}

export class UnauthorizedError extends Error {
    
    code: number;
    layer: string;
    errorMessage: string;

    constructor(layer:string) {
        super();
        this.name = this.constructor.name;
        this.errorMessage = 'Invalid email and/or password.';
        this.code = 401;
        this.layer = layer
    } 
}

export class UnauthorizedSessionError extends UnauthorizedError {

    constructor(layer: string) {
        super(layer)
        this.errorMessage = 'Missing valid session cookie.'
    }
}