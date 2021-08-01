import { User, UsersAttributes } from '../models/user.model';
import GitHubAPI from '../oAuth/git.oauth';

class UserService {
  async getGitUserInfo(code: string) {
    const { login: name, avatar_url: avatarURL } = await GitHubAPI.getUserInfo(code);
    return { name, avatarURL, accessToken: code };
  }
  async createUser(user: UsersAttributes) {
    let _user = await User.findOne({ where: { name: user.name } });

    if (!_user) {
      _user = await User.create({
        name: user.name,
        avatarURL: user.avatarURL,
        accessToken: user.accessToken,
      });
    }
    return _user.get({ plain: true });
  }
}

export default new UserService();
