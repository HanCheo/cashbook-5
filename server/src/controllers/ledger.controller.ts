import { Request, Response } from 'express';
import LedgerService from '../services/ledger.service';

class UserController {
  async getLedgersByDate(req: Request, res: Response) {
    const queryDate = req.query.date as string;
    console.log(queryDate);

    const date = new Date(queryDate);
    console.log(date);

    const userId = req.user.id!;

    const ledgers = await LedgerService.getLedgersByMonth(date, userId);

    res.send({
      success: true,
      data: ledgers,
    });
  }
}

export default new UserController();
