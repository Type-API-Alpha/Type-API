import { ITeam, IUser, uuid } from "../interfaces/interfaces";
import TeamRepository from "../repositories/team-repository";
import UserRepository from "../repositories/user-repository";
import teamRouter from "../routes/team-router";
import { ConflictError, NotFoundError } from "../utils/err";

export default class TeamService {

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

    static async checkLeader(teamID:uuid): Promise<Partial<ITeam>>{
        const checkTeamLeader:ITeam | null = await TeamRepository.findTeamByID(teamID)
        if(!checkTeamLeader){
            throw new NotFoundError('Service Layer', 'Team');
        } 
        return checkTeamLeader;
    }

    static async deleteMember(teamID: uuid, userID: uuid):Promise<Partial<IUser>> {
        const checkTeam:ITeam | null = await TeamRepository.findTeamByID(teamID);
        if(!checkTeam){    
            throw new NotFoundError('Service Layer', 'Team');
        }
        const checkUser:IUser | null = await UserRepository.findUserByID(userID);      
        if(!checkUser){
            throw new NotFoundError('Service Layer', 'User');   
        }
        else if(checkUser.squad !== teamID){
            throw new ConflictError('Service layer', 'User does not belong to the selected Team')
        }
        else{
            const deletedMember = await TeamRepository.deleteMember(userID, teamID);
            const { password, ... entityWithoutPassword } = deletedMember;
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
}