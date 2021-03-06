import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/user.repository';
import env from '../config';

class JwtService {
  generate<T extends object>(user: T) {
    return jwt.sign(user, env.JWT_SECRET, {
      expiresIn: '1h',
    });
  }

  verify(token: string) {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  async userByRefreshToken(refreshToken: string) {
    return await UserRepository.getUserByRefresh(refreshToken);
  }

  refresh() {
    // refresh token 발급
    return jwt.sign({}, env.JWT_SECRET, {
      expiresIn: '14d',
    });
  }
}

export default new JwtService();
