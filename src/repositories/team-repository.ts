import dBConnection from "../database/db-connection";
import { ITeam, IUser, uuid } from "../interfaces/interfaces";
export default class TeamRepository {

  static async getAllTeams(): Promise<ITeam[] | []> {
    const query = "SELECT * FROM Team";
    const { rows } = await dBConnection.query(query);
    return rows;
  }

  static async getTeamById(teamId: string): Promise<ITeam> {
    const query = "SELECT * FROM Team WHERE id = $1";
    const { rows } = await dBConnection.query(query, [teamId]);
    return rows[0];
  }

  static async getTeamByLeaderId(userId: string): Promise<ITeam> {
    const query = "SELECT * FROM Team WHERE leader = $1";
    const { rows } = await dBConnection.query(query, [userId]);
    return rows[0];
  }

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
}