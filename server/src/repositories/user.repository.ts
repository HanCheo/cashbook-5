import User, { UsersAttributes } from '../models/user.model';

class UserRepository {
  async getUser(gitUsername: string): Promise<UsersAttributes | null> {
    const _user = await User.findOne({ where: { gitUsername } });

    if (!_user) return null;

    return _user.get({ plain: true });
  }

  async createUser(gitUsername: string, avatarURL: string): Promise<UsersAttributes> {
    const _user = await User.create({
      gitUsername,
      avatarURL,
    });
    //TODO : 실패처리 추가

    return _user.get({ plain: true });
  }
}

export default UserRepository;
