import sequelize from '../db/sequlze';
import User, { UsersAttributes } from '../models/user.model';

const USER_CREATE_FAIL_MESSAGE = "유저 Row 생성 실패";

class UserRepository {
  // TODO: change UserAttributes => User.
  async getUser(gitUsername: string): Promise<UsersAttributes | null> {
    const originUser = await User.findOne({ where: { gitUsername } });
    return originUser ? originUser.get({ plain: true }) : originUser;
  }

  // TODO: change UserAttributes => User.
  async getUserByRefresh(refreshToken: string): Promise<UsersAttributes | null> {
    const _user = await User.findOne({
      attributes: ['id', 'gitUsername', 'avatarURL'],
      where: { refreshToken },
    });

    if (!_user) {
      return null;
    } else {
      return _user.get({ plain: true });
    }
  }

  async updateUserRefresh(userId: number, refreshToken: string) {
    const t = await sequelize.transaction();
    try {
      await User.update({ refreshToken }, { where: { id: userId }, transaction: t });
      await t.commit();
    } catch (err) {
      t.rollback();
    }
  }

  // TODO: change UserAttributes => User.
  async createUser(gitUsername: string, avatarURL: string, refreshToken: string): Promise<UsersAttributes> {
    const t = await sequelize.transaction();
    const originUser = await this.getUser(gitUsername);
    try {
      //유저가 있으면 업데이트
      if (originUser) {
        await User.update({ refreshToken, avatarURL }, { where: { gitUsername } });
        const _user = (await this.getUser(gitUsername)) as UsersAttributes;
        return _user;
      }
      //없으면 생성
      const _user = await User.create({
        gitUsername,
        avatarURL,
        refreshToken,
      });
      if (!_user) throw new Error('사용자 생성실패');

      return _user.get({ plain: true });
    } catch (err) {
      t.rollback();
      throw new Error('Error: ' + err);
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;