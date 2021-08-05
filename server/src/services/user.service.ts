import { UsersAttributes } from '../models/user.model';
import UserRepository from '../repositories/user.repository';
import GitHubAPI from '../oauth/git.oauth';

class UserService {
  async getGitUserInfo(code: string) {
    const { login: gitUsername, avatar_url: avatarURL } = await GitHubAPI.getUserInfo(code);
    return { gitUsername, avatarURL, accessToken: code };
  }

  async createUser(user: UsersAttributes, refreshToken: string): Promise<UsersAttributes> {
    const { gitUsername, avatarURL } = user;
    return UserRepository.createUser(gitUsername, avatarURL, refreshToken);
  }
}

export default new UserService();
