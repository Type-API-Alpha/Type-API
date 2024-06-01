import { ILoginTokenPayload } from "../interfaces/interfaces";
import Jwt from "jsonwebtoken";
import { jwt } from "../interfaces/interfaces";
import dotenv from "dotenv";

dotenv.config();
const tokenSecretKey:string = process.env.JWT_PWD as string;

export const createToken = (payload:ILoginTokenPayload,  options: {expiresIn: string}):string => {
    const token = Jwt.sign(payload, tokenSecretKey , options)
    return token;
}

export const verifyToken = (token: jwt) => {
    return Jwt.verify(token, tokenSecretKey, function(err, decoded) {
        if (err) {
            return false;
        } else {
            return decoded;
        }
    })
}

module.exports = {
    createToken,
    verifyToken
}