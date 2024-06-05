import dBConnection from "../database/db-connection";
import { IUser, IUserDatabase, email, uuid } from "../interfaces/interfaces";

export default class UserRepository {
    
    static async insertNewUser(userInfos: Partial<IUser>):Promise<IUser | void>{
        const query = `
        INSERT INTO "User" 
        (username, email, first_name, last_name, password) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;

        const { rows } = await dBConnection.query(query, [... Object.values(userInfos)]);
        return rows[0];
    }

    static async findUserByUsername(username:string):Promise<IUser | null> {
        const query = 'SELECT * FROM "User" WHERE username = $1';
        const { rows } = await dBConnection.query(query, [ username ]);
        return rows[0];
    } 

    static async findUserByEmail(email: email):Promise<IUser | null> {
        const query = 'SELECT * FROM "User" WHERE email = $1';
        const { rows } = await dBConnection.query(query, [ email ]);
        return rows[0] as IUser;
    }
    
    static async findUserByID(userID: uuid):Promise<IUser | null> {
        const query = 'SELECT id, username, email, first_name as "firstName", last_name as "lastName", squad, is_admin as "isAdmin" FROM "User" WHERE id = $1';
        const { rows } = await dBConnection.query(query, [ userID ]);
        return rows[0] as IUser;
    }

    static async deleteUser(userID:uuid):Promise<IUser>{
        const query = 'DELETE FROM "User" WHERE id = $1 RETURNING * ';
        const {rows} = await dBConnection.query(query, [userID]);
        return rows[0] as IUser;
    }

    static async findBySquad(teamID:uuid):Promise<IUser>{
        const query = 'SELECT * FROM "User" WHERE squad = $1';
        const {rows} = await dBConnection.query(query, [teamID]);
        return rows[0] as IUser;
    }

    static async updateUser(userInfos:Partial<IUser>, userID: uuid):Promise<IUser> {

        const userData:Partial<IUserDatabase> = {};

        userInfos.username ? userData['username'] = userInfos.username : null;
        userInfos.firstName ? userData['first_name'] = userInfos.firstName : null;
        userInfos.lastName ? userData['last_name'] = userInfos.lastName : null;
        userInfos.email ? userData['email'] = userInfos.email : null;
        userInfos.password ? userData['password'] = userInfos.password : null;
        userInfos.isAdmin ? userData['is_admin'] = userInfos.isAdmin : null;
        
        const userPropertyList:Array<string> = Object.keys(userData);
        const newValues:Array<string | boolean> = Object.values(userData);
        newValues.push(userID);

        let query = `UPDATE "User" SET `;
        
        for (let i = 0; i < userPropertyList.length; i++) {
            const property = ` ${userPropertyList[i]} = $${i + 1},`
            query += property;
        }
        
        const formattedQuery = query.slice(0, -1) + ` WHERE id = $${userPropertyList.length + 1} RETURNING *;`;
        const { rows } = await dBConnection.query(formattedQuery, newValues);
        
        return rows[0];
    }
}