import { User, UsersAttributes } from '../models/user.model';
import UserRepository from '../repositories/user.repository';
import GitHubAPI from '../oAuth/git.oauth';

class UserService {
  UserRepository: UserRepository;
  constructor() {
    this.UserRepository = new UserRepository();
  }
  async getGitUserInfo(code: string) {
    const { login: gitUsername, avatar_url: avatarURL } = await GitHubAPI.getUserInfo(code);
    return { gitUsername, avatarURL, accessToken: code };
  }
  async createUser(user: UsersAttributes): Promise<UsersAttributes> {
    const { gitUsername, avatarURL } = user;

    const originUser = await this.UserRepository.getUser(gitUsername);
    if (originUser) return originUser;

    return this.UserRepository.createUser(gitUsername, avatarURL);
  }
}

export default new UserService();
