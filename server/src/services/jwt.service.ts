import jwt from 'jsonwebtoken';
import env from '../config';

class JwtService {
  generate<T extends object>(user: T) {
    console.log(user);
    return jwt.sign(user, env.JWT_SECRET, {
      expiresIn: '1d',
    });
  }

  verify(token: string) {
    return jwt.verify(token, env.JWT_SECRET);
  }
  refresh() {
    // refresh token 발급
    return jwt.sign({}, env.JWT_SECRET, {
      // refresh token은 payload 없이 발급
      expiresIn: '7d',
    });
  }
}

export default new JwtService();
