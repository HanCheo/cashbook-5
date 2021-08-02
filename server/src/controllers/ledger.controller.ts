import { Request, Response } from 'express';
import LedgerService from '../services/ledger.service';

class UserController {
  async getLedgers(req: Request, res: Response) {
    const date = new Date(req.body.date);
    const userId = req.user.id!;

    const ledgers = await LedgerService.getLedgersByMonth(date, userId);

    res.send(ledgers);
  }
}

export default new UserController();
