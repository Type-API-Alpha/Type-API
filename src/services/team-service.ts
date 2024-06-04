import { ITeam } from "../interfaces/interfaces";
import TeamRepository from "../repositories/team-repository";

export default class TeamService {

  static async getAllTeams(): Promise<ITeam[] | []> {
    const teams = await TeamRepository.getAllTeams();
    return teams;
  }
}