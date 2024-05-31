import dBConnection from "../database/db-connection";
import { IUser, email } from "../interfaces/interfaces";

export default class UserRepository {
    
    static async insertNewUser(userInfos: Partial<IUser>):Promise<IUser | void>{
        const query = `
        INSERT INTO "User" 
        (username, email, first_name, last_name, password) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;

        const { rows } = await dBConnection.query(query, [... Object.values(userInfos)]);
        return rows[0];
    }

    static async findUserByUsername(username:string):Promise<IUser | void> {
        const query = 'SELECT * FROM "User" WHERE username = $1';
        const { rows } = await dBConnection.query(query, [ username ]);
        return rows[0];
    } 

    static async findUserByEmail(email: email):Promise<IUser | void> {
        const query = 'SELECT * FROM "User" WHERE email = $1';
        const { rows } = await dBConnection.query(query, [ email ]);
        return rows[0] as IUser;
    } 
}