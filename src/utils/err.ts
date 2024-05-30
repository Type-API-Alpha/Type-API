
export class InvalidDataError extends Error {
    
    code: number;
    layer: string;
    errorMessage: string;
    messages?: Array<string>

    constructor(layer:string, messages?: Array<string>) {
        super();
        this.name = this.constructor.name;
        this.errorMessage = 'Inválid data';
        this.messages = messages;
        this.code = 400;
        this.layer = layer
    } 
}