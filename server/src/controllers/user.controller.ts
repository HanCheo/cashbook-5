import { Request, Response } from 'express';
import { SUCCESS } from '../utils/HttpStatus';

class UserController {
  getUser(req: Request, res: Response) {
    if (req.user) {
      // TODO: change response ok => success
      res.status(SUCCESS).send({ ok: true, data: req.user });
    } else {
      // TODO: change response ok => success, add error for error message.
      res.status(SUCCESS).send({ ok: false });
    }
  }
}

export default new UserController();
