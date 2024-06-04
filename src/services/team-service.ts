import TeamRepository from "../repositories/team-repository";
import { ITeam, IUser, uuid } from "../interfaces/interfaces";
import UserRepository from "../repositories/user-repository";
import { ConflictError, NotFoundError, UnauthorizedSessionError } from "../utils/err";
export default class TeamService {

  static async getAllTeams(): Promise<ITeam[] | []> {
    const teams = await TeamRepository.getAllTeams();
    return teams;
  }

  static async createTeam(team: ITeam): Promise<Partial<ITeam>>{
    const teamNameUsed = await TeamRepository.findUserByName(team.name);
    if(teamNameUsed){
      throw new ConflictError('Service layer', 'Name already used.');
    }

    const userID = await TeamRepository.findTeamByID(team.leader as string);
    if(!userID){
      throw new NotFoundError('Service layer', 'User already used.');
    }

    await TeamRepository.addNewMember(team.name, team.leader);

    const teamData:Partial<ITeam> = {
      name: team.name,
      leader: team.leader
  }

  const teamReturn = await TeamRepository.createTeam(teamData);

  const { id, name, leader, ... teamWithoutPass } = teamReturn as ITeam;

  return teamWithoutPass;
  }

  static async addNewMember(teamID: uuid, userID: uuid):Promise<Partial<IUser>> {

    const registeredUser:IUser | null = await UserRepository.findUserByID(userID);
    if (!registeredUser) {
        throw new NotFoundError('Service layer', 'User');
    }

    const registeredTeam:ITeam | null = await TeamRepository.findTeamByID(teamID);
    if (!registeredTeam) {
        throw new NotFoundError('Service layer', 'Team');
    }

    if (registeredUser.squad) {
        throw new ConflictError('Service layer', 'User cannot be added to the team: the user is already a member of another team.');
    }

    const newMember = await TeamRepository.addNewMember(teamID, userID);
    const { password, ... newMemberWithoutPass } = newMember;

    return newMemberWithoutPass;
  }
}