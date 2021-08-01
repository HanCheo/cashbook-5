import { Request, Response } from 'express';

class UserController {
  getUser(req: Request, res: Response) {
    if (req.user) res.send({ ok: true, data: req.user });
    res.send({ ok: false });
  }
}

export default new UserController();
