import TeamRepository from "../repositories/team-repository";
import { ILoginTokenPayload, ITeam, IUser, uuid } from "../interfaces/interfaces";
import UserRepository from "../repositories/user-repository";
import { ConflictError, NotFoundError } from "../utils/err";

export default class TeamService {

    static async getAllTeams(): Promise<ITeam[] | []> {
      const teams = await TeamRepository.getAllTeams();
      return teams;
    }

    static async getTeamById(teamId: string): Promise<ITeam> {
      const team = await TeamRepository.getTeamById(teamId);
      return team;
    }
    
    static async getMembersByTeamId(teamId: uuid): Promise<IUser[]> {
      const members = await UserRepository.findAllUsersBySquad(teamId);
      return members;
    }
    
    static async createTeam(team: ITeam): Promise<Partial<ITeam>> {
      const teamNameUsed = await TeamRepository.findTeamByName(team.name);
      if (teamNameUsed) {
        throw new ConflictError("Service layer", "Team Name already used.");
      }

      const userData = await UserRepository.findUserByID(team.leader as string);

      if (!userData) {
        throw new NotFoundError("Service layer", "User");
      }
      if (userData.squad != null) {
        throw new ConflictError("Service layer", "User is already on a team");
      }
      if (userData.isAdmin) {
        throw new ConflictError(
          "Service layer",
          "The admin cannot be a leader or be part of a group."
        );
      }

      const teamData: Partial<ITeam> = {
        name: team.name,
        leader: team.leader,
      };

      const teamReturn = await TeamRepository.createTeam(teamData);

      await TeamRepository.addNewMember(teamReturn.id, team.leader);

      return teamReturn;
    }

    static async addNewMember(
      teamID: uuid,
      userID: uuid
    ): Promise<Partial<IUser>> {
      const registeredUser: IUser | null = await UserRepository.findUserByID(
        userID
      );
      if (!registeredUser) {
        throw new NotFoundError("Service layer", "User");
      }

      const registeredTeam: ITeam | null = await TeamRepository.findTeamByID(
        teamID
      );
      if (!registeredTeam) {
        throw new NotFoundError("Service layer", "Team");
      }

      if (registeredUser.squad) {
        throw new ConflictError(
          "Service layer",
          "User cannot be added to the team: the user is already a member of another team."
        );
      }
      console.log(registeredUser);
      
      if (registeredUser.isAdmin) {
        throw new ConflictError(
          "Service layer",
          "The admin cannot be a leader or be part of a group."
        );
      }

      const newMember = await TeamRepository.addNewMember(teamID, userID);
      const { password, ...newMemberWithoutPass } = newMember;

      return newMemberWithoutPass;
    }

    static async checkLeader(teamID: uuid): Promise<Partial<ITeam>> {
      const checkTeamLeader: ITeam | null = await TeamRepository.findTeamByID(
        teamID
      );
      if (!checkTeamLeader) {
        throw new NotFoundError("Service Layer", "Team");
      }
      return checkTeamLeader;
    }

    static async deleteMember(
      teamID: uuid,
      userID: uuid
    ): Promise<Partial<IUser>> {
      const checkTeam: ITeam | null = await TeamRepository.findTeamByID(teamID);
      if (!checkTeam) {
        throw new NotFoundError("Service Layer", "Team");
      }
      const checkUser: IUser | null = await UserRepository.findUserByID(userID);
      if (!checkUser) {
        throw new NotFoundError("Service Layer", "User");
      } else if (checkUser.squad !== teamID) {
        throw new ConflictError(
          "Service layer",
          "User does not belong to the selected Team"
        );
      } else {
        const deletedMember = await TeamRepository.deleteMember(userID, teamID);
        const { password, ...entityWithoutPassword } = deletedMember;
        return entityWithoutPassword;
      }
    }

    static async deleteTeam(teamID: uuid): Promise<Partial<IUser>>{
        const checkTeam:ITeam | null = await TeamRepository.findTeamByID(teamID);
        if(!checkTeam){        
            throw new NotFoundError('Service Layer', 'Team');
        }
        const emptyCheck:IUser | null = await UserRepository.findBySquad(teamID);
        if(emptyCheck){
            throw new ConflictError('Service Layer', 'The team cannot be deleted, since is not empty');
        }
        const erasedTeam = await TeamRepository.deleteTeam(teamID)
        return erasedTeam;
      }

    static async updateTeam(loggedUser: ILoginTokenPayload, teamInfos: Partial<ITeam>, teamID: string): Promise<ITeam>{
      const team = await TeamRepository.findTeamByID(teamID);
      if(!team){
        throw new NotFoundError('Service layer', 'Team');
      }

      const updatedTeam: ITeam = {
        ...team,
        ...teamInfos
      }

      if(teamInfos.name){
        const teamNameUsed = await TeamRepository.findTeamByName(updatedTeam.name);
        if(teamNameUsed){
          throw new ConflictError('Service layer', 'Team Name already used.');
        }
      }

      const userData = await UserRepository.findUserByID(updatedTeam.leader as string);

      if(!userData){
        throw new NotFoundError('Service layer', 'User');
      }
      if(userData.squad !== updatedTeam.id){
        throw new ConflictError('Service layer', 'User is not part of the team');
      }
      if(userData.isAdmin){
        throw new ConflictError('Service layer', 'The admin cannot be a leader or be part of a group.');
      }

      const updatedTeamData = await TeamRepository.updateTeam(updatedTeam);
      return updatedTeamData;
    }
}
