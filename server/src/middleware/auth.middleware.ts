import { Request, Response, NextFunction } from 'express';
import { UsersAttributes } from '../models/user.model';
import UserRepository from '../repositories/user.repository';
import JwtService from '../services/jwt.service';
import { UNAUTHORIZED } from '../utils/HttpStatus';

const ERROR_USER_IS_NOT_EXIST = '현재 토큰을 가진 유저가 없습니다.';
const ERROR_ALL_TOKEN_IS_EXPIRED = '모든 토큰의 유효기간이 지났습니다.';
const ERROR_HEADER_COOKIE_IS_NOT_EXIST = '헤더에 쿠키가 존재하지않습니다.';

const ErrorJWT = (res: Response, message: string) => {
  res.status(UNAUTHORIZED).send({ success: false, message }).end();
};

const authJWT = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.cookie) {
    ErrorJWT(res, ERROR_HEADER_COOKIE_IS_NOT_EXIST);
    return;
  }

  // get access token from headers
  const accesstoken = req.headers.cookie.split('accessToken=')[1]?.split(';')[0];
  const refreshToken = req.headers.cookie.split('refreshToken=')[1]?.split(';')[0];

  const access = JwtService.verify(accesstoken);
  const refresh = JwtService.verify(refreshToken);

  let user = {} as UsersAttributes;

  if (!access) {
    //accToken만 유효기간이 지남
    if (!refresh) {
      //acc, ref 모두 유효기간이 지남
      ErrorJWT(res, ERROR_ALL_TOKEN_IS_EXPIRED);
      return;
    } else {
      // refresh 기반으로 유저 조회
      const _user = await JwtService.userByRefreshToken(refreshToken);
      if (_user === null) {
        ErrorJWT(res, ERROR_USER_IS_NOT_EXIST);
        return;
      }
      user = _user;

      //acc 재발급
      const newAccessToken = JwtService.generate(user);
      res.append('Set-Cookie', `accessToken=${newAccessToken}; Path=/; HttpOnly;`);
    }
  } else {
    user = access as UsersAttributes;
    if (!refresh) {
      //ref 만 유효기간 지남
      const newRefreshToken = JwtService.refresh();
      await UserRepository.updateUserRefresh(user.id!, newRefreshToken);
      res.append('Set-Cookie', `refreshToken=${newRefreshToken}; Path=/; HttpOnly;`);
    }
  }

  const { id, gitUsername, avatarURL } = user;
  req.user = {
    id,
    gitUsername,
    avatarURL,
  };

  return next();
};

export default authJWT;
