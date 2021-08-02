import { Request, Response } from 'express';
import { LedgerRequestDTO, LedgerResponseDTO } from '../dto/LedgerDTO';
import LedgerService from '../services/ledger.service';

class LedgerController {
  async getLedgersByDate(req: Request, res: Response) {
    const queryDate = req.query.date as string;
    const date = new Date(queryDate);
    const userId = req.user.id!;

    const ledgers: LedgerResponseDTO[] = await LedgerService.getLedgersByMonth(date, userId);

    res.send({
      success: true,
      data: ledgers,
    });
  }

  async createLedger(req: Request, res: Response) {
    const userId = Number(req.user.id);

    const {
      categoryId,
      date,
      content,
      amount,
    } = req.body;

    const ledgerDto: LedgerRequestDTO = {
      categoryId: Number(categoryId),
      date: new Date(date),
      content,
      amount: Number(amount),
    };

    const newLedgerId = await LedgerService.createLedger(ledgerDto, userId);

    if (newLedgerId) {
      res.send({
        succuss: true,
        data: { id: newLedgerId }
      });
      res.end();
    } else {
      // TODO: if create ledger fail, return explicit error message
      res.send({
        succuss: false,
      });
      res.end();
    }
  }
}

export default new LedgerController();
