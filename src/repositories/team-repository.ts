import dBConnection from "../database/db-connection";
import { ITeam } from "../interfaces/interfaces";
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
}