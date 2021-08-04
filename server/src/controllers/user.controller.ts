import { Request, Response } from 'express';
import { SUCCESS } from '../utils/HttpStatus';

class UserController {
  getUser(req: Request, res: Response) {
    if (req.user) {
      res.status(SUCCESS).send({ success: true, data: req.user });
    } else {
      res.status(SUCCESS).send({ success: false, message: '해당 정보를 가진 유저가 없습니다' });
    }
  }
}

export default new UserController();
