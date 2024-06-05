import dBConnection from "../database/db-connection";
import { IUser, email, uuid } from "../interfaces/interfaces";

export default class UserRepository {
	static async getAllUsers(): Promise<Partial<IUser[]>> {
		const query = `SELECT id, username, email, first_name, last_name, squad FROM "User";`;
		const { rows } = await dBConnection.query(query);
		return rows;
	}

	static async getUserByID(userID: uuid): Promise<Partial<IUser>> {
		const query = `SELECT id, username, email, first_name, last_name, squad FROM "User" WHERE id = $1;`;
		const { rows } = await dBConnection.query(query, [userID]);
		return rows[0];
	}

	static async insertNewUser(
		userInfos: Partial<IUser>
	): Promise<IUser | void> {
		const query = `
        INSERT INTO "User" 
        (username, email, first_name, last_name, password) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;

		const { rows } = await dBConnection.query(query, [
			...Object.values(userInfos),
		]);
		return rows[0];
	}

	static async findUserByUsername(username: string): Promise<IUser | null> {
		const query = 'SELECT * FROM "User" WHERE username = $1';
		const { rows } = await dBConnection.query(query, [username]);
		return rows[0];
	}

    static async findUserByEmail(email: email):Promise<IUser | null> {
        const query = 'SELECT * FROM "User" WHERE email = $1';
        const { rows } = await dBConnection.query(query, [ email ]);
        return rows[0] as IUser;
    }
    
    static async findUserByID(userID: uuid):Promise<IUser | null> {
        const query = 'SELECT * FROM "User" WHERE id = $1';
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
}
