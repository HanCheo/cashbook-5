import { Request, Response } from 'express';
import { BAD_REQUEST, SERVER_ERROR } from '../utils/HttpStatus';
import { LedgerRequestDTO, LedgerResponseDTO } from '../dto/LedgerDTO';
import LedgerService from '../services/ledger.service';
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
      paymentTypeId,
      categoryId,
      date,
      content,
      amount,
    } = req.body;

    const paymentTypeIdAsNumber = Number(paymentTypeId);
    if (isNaN(paymentTypeIdAsNumber)) {
      res.status(BAD_REQUEST).send({
        error: "paymentType id is empty or invalid"
      }).end();
      return;
    }

    // TODO: payment Type 가 db에 있는 건지 체크 (Payment API 추가해야함.)
    // TODO: payment Type 이 현재 유저의 결제 타입인지 체크

    const categoryIdAsNumber = Number(categoryId);

    if (isNaN(categoryIdAsNumber)) {
      res.status(BAD_REQUEST).send({
        error: "category id is empty or invalid"
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
      paymentTypeId: paymentTypeIdAsNumber,
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
