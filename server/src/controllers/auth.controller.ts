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
    const user = await UserService.createUser(gitUser);
    const jwtAccessToken = await JwtService.generate(user);

    res.append('Set-Cookie', `accessToken=${jwtAccessToken}; Path=/; HttpOnly;`);
    res.redirect(env.DEV_CLIENT_URL);
  }
}

export default new AuthController();
