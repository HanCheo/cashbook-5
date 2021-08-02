import { Request, Response } from 'express';
import { LedgerRequestDTO, LedgerResponseDTO } from '../dto/LedgerDTO';
import LedgerService from '../services/ledger.service';
import CategoryService from '../services/category.service';
import { BAD_REQUEST, SERVER_ERROR } from '../utils/HttpStatus';
import categoryService from '../services/category.service';

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
    // Assert User Id is valid.
    const userIdAsNumber = Number(req.user.id);

    const {
      categoryId,
      date,
      content,
      amount,
    } = req.body;

    const categoryIdAsNumber = Number(categoryId);

    if (isNaN(categoryIdAsNumber)) {
      res.status(BAD_REQUEST).send({
        error: "category id is invalid"
      }).end();
      return;
    }

    const category = await categoryService.getCategory(categoryIdAsNumber);
    if (!category) {
      res.status(BAD_REQUEST).send({
        error: `there is no corresponding category(id:${categoryIdAsNumber}).`
      }).end();
      return;
    }

    const amountAsNumber = Number(amount);

    if (isNaN(amountAsNumber)) {
      res.status(BAD_REQUEST).send({
        error: "amount value is invalid"
      }).end();
      return;
    }

    const ledgerDto: LedgerRequestDTO = {
      categoryId: categoryIdAsNumber,
      date: new Date(date),
      content,
      amount: amountAsNumber,
    };

    const newLedgerId = await LedgerService.createLedger(ledgerDto, userIdAsNumber);

    if (newLedgerId) {
      res.send({
        succuss: true,
        data: { id: newLedgerId }
      });
      res.end();
    } else {
      res.status(SERVER_ERROR).send({
        succuss: false,
        error: "Ledger Creation is fail."
      });
      res.end();
    }
  }
}

export default new LedgerController();
