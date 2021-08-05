import sequelize from '../db/sequlze';
import User, { UsersAttributes } from '../models/user.model';

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
    try {
      await User.update({ refreshToken }, { where: { id: userId } });
    } catch (err) {
      throw new Error('Error: ' + err);
    }
  }

  // TODO: change UserAttributes => User.
  async createUser(gitUsername: string, avatarURL: string, refreshToken: string): Promise<UsersAttributes> {
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

      // TODO: Append detail error message
      if (!_user) throw new Error('사용자 생성실패');

      // TODO: change to only return User class
      return _user.get({ plain: true });
    } catch (err) {
      throw new Error('Error: ' + err);
    }
  }

  async getUserWithPaymentTypes(userIdAsNumber: number): Promise<User | null> {
    const userWidthPaymentTypes = User.findOne({
      include: [User.associations.paymentTypes],
      where: {
        id: userIdAsNumber,
      },
    });
    return userWidthPaymentTypes;
  }
}

const userRepository = new UserRepository();
export default userRepository;
