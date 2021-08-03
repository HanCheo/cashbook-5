import { Request, Response } from 'express';
import env from '../config';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import JwtService from '../services/jwt.service';

class AuthController {
  async callback(req: Request, res: Response) {
    const { code } = req.query;

    const token = await AuthService.getGitAccessToken(code as string);
    const gitUser = await UserService.getGitUserInfo(token);
    const jwtRefreshToken = JwtService.refresh();
    const { id, gitUsername, avatarURL } = await UserService.createUser(gitUser, jwtRefreshToken);
    const jwtAccessToken = JwtService.generate({ id, gitUsername, avatarURL });

    res.append('Set-Cookie', `refreshToken=${jwtRefreshToken}; Path=/; HttpOnly;`);
    res.append('Set-Cookie', `accessToken=${jwtAccessToken}; Path=/; HttpOnly;`);
    res.redirect(env.DEV_CLIENT_URL);
    res.end();
  }

  gitOAuthUrl(req: Request, res: Response) {
    res.send({ url: `https://github.com/login/oauth/authorize?client_id=${env.GIT_CLIENT_ID}` });
    res.end();
  }
}

export default new AuthController();
