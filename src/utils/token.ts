import { ILoginTokenPayload } from "../interfaces/interfaces";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { jwt } from "../interfaces/interfaces";
import dotenv from "dotenv";

dotenv.config();
const tokenSecretKey:string = process.env.JWT_PWD as string;

export const createToken = (payload:ILoginTokenPayload,  options: {expiresIn: string}):string => {
    const token = Jwt.sign(payload, tokenSecretKey , options)
    return token;
}

export const verifyToken = (token: jwt):false | JwtPayload => {
    let validationResult: false | JwtPayload = false;

    Jwt.verify(token, tokenSecretKey, function(err, decoded): void {
        if (err) {
            return;
        } else {
            validationResult = decoded as JwtPayload;
        }
    })

    return validationResult;
}

module.exports = {
    createToken,
    verifyToken
}