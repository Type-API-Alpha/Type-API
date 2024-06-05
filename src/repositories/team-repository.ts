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

  static async createTeam(team: Partial<ITeam>): Promise<ITeam>{
    const query = "INSERT INTO Team (name, leader) VALUES ($1, $2) RETURNING *";

    const { rows } = await dBConnection.query(query, [... Object.values(team)]);
    return rows[0];
  }

  static async findTeamByID(teamID: uuid):Promise<ITeam | null> {
      const query = 'SELECT * FROM Team WHERE id = $1';
      const { rows } = await dBConnection.query(query, [teamID]);
      return rows[0];
  }

  static async findTeamByName(name: string):Promise<ITeam | null> {
    const query = 'SELECT * FROM Team WHERE name = $1';
    const { rows } = await dBConnection.query(query, [ name ]);
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

    static async updateTeam(teamInfos: ITeam): Promise<ITeam>{
        const team: ITeam = {name: teamInfos.name, leader: teamInfos.leader, id: teamInfos.id}

        const query = 'UPDATE Team SET name = $1, leader = $2 WHERE id = $3'

        const { rows } = await dBConnection.query(query, [... Object.values(team)]);
        return rows[0];
    }

}
