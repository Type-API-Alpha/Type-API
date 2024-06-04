import dBConnection from "../database/db-connection";
import { ITeam, IUser, uuid } from "../interfaces/interfaces";

export default class TeamRepository {

    static async findTeamByID(teamID: uuid):Promise<ITeam> {
        const query = 'SELECT * FROM Team WHERE id = $1';
        const { rows } = await dBConnection.query(query, [teamID]);
        return rows[0];
    }

    static async addNewMember(teamID: uuid, userID: uuid):Promise<IUser> {
        const query = 'UPDATE "User" SET squad = $1 WHERE id = $2 RETURNING *';
        const { rows } = await dBConnection.query(query, [teamID, userID]);
        return rows[0];
    }

    static async deleteMember(userID: uuid, teamID: uuid): Promise<IUser> {
        const query = 'UPDATE "User" SET squad = NULL WHERE id = $1 AND squad = $2 RETURNING *';
        const { rows } = await dBConnection.query(query, [userID, teamID])
        return rows[0]
    }

    static async deleteTeam(teamID: uuid): Promise<IUser> {
        const query = 'DELETE FROM Team WHERE id = $1 RETURNING *';
        const {rows} = await dBConnection.query(query, [teamID]);
        return rows[0]
    }

}