import jwt from 'jsonwebtoken';
import env from '../config';

class JwtService {
  generate<T extends object>(user: T) {
    console.log(user);
    return jwt.sign(user, env.JWT_SECRET, {
      expiresIn: 3600,
    });
  }

  verify(token: string) {
    return jwt.verify(token, env.JWT_SECRET);
  }
}

// const refresh = () => {
//   // refresh token 발급
//   return jwt.sign({}, process.env.JWT_SECRET as string, {
//     // refresh token은 payload 없이 발급
//     algorithm: 'HS256',
//     expiresIn: '1d',
//   });
// };

export default new JwtService();
