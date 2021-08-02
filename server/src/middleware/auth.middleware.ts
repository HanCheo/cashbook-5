import { Request, Response, NextFunction } from 'express';
import JwtService from '../services/jwt.service';

const authJWT = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.cookie) throw new Error('There is no cookie');

  // get access token from headers
  const token = req.headers.cookie.split('accessToken=')[1].split(';')[0];
  if (!token) throw new Error('There is no token');

  const user = JwtService.verify(token);
  if (typeof user !== 'string') {
    const { id, gitUsername, avatarURL } = user;
    req.user = {
      id,
      gitUsername,
      avatarURL,
    };
  } else {
    throw new Error('Token is expires');
  }

  return next();
};

export default authJWT;
