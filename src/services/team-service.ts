import { ITeam, IUser, uuid } from "../interfaces/interfaces";
import TeamRepository from "../repositories/team-repository";
import UserRepository from "../repositories/user-repository";
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
}