
export class InvalidDataError extends Error {
    
    code: number;
    layer: string;
    message: string;
    messages?: Array<string>

    constructor(layer:string, message: string, messages?: Array<string>) {
        super();
        this.name = this.constructor.name;
        this.message = message;
        this.messages = messages;
        this.code = 400;
        this.layer = layer
    } 
}