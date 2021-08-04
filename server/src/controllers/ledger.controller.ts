import { Request, Response } from 'express';
import { BAD_REQUEST, SERVER_ERROR } from '../utils/HttpStatus';
import { LedgerRequestDTO, LedgerResponseDTO } from '../dto/LedgerDTO';
import LedgerService from '../services/ledger.service';
import categoryService from '../services/category.service';

const ERROR_PARAMETER_INVALID = '입력 값이 잘못되었습니다.';
const ERROR_CATEGORY_NOT_FOUND = '카테고리를 찾을 수 없습니다.';
const ERROR_CREATION_LEDGER_FAIL = '가계부 데이터를 생성하는데 실패했습니다.';

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

  async getLedgersGroupByDate(req: Request, res: Response) {
    const queryDate = req.query.date as string;
    const date = new Date(queryDate);
    const userId = req.user.id!;
    const ledgers: LedgerResponseDTO[] = await LedgerService.getLedgersByMonth(date, userId);
    const groupLedgers = LedgerService.convertToDayGroupLedgers(ledgers);

    res.send({
      success: true,
      data: groupLedgers,
    });
  }

  async getStatisticLedgersByDate(req: Request, res: Response) {
    const queryDate = req.query.date as string;
    const date = new Date(queryDate);
    const userId = req.user.id!;
    const ledgers: LedgerResponseDTO[] = await LedgerService.getLedgersByMonth(date, userId);
    const statisticLedgers = LedgerService.convertToStatisticLedgers(ledgers, date);

    res.send({
      success: true,
      data: statisticLedgers,
    });
  }

  async createLedger(req: Request, res: Response) {
    // Assert User Id is valid.
    const userIdAsNumber = Number(req.user.id);

    const { paymentTypeId, categoryId, date, content, amount } = req.body;
    const paymentTypeIdAsNumber = Number(paymentTypeId);

    if (isNaN(paymentTypeIdAsNumber)) {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_PARAMETER_INVALID + '(paymentType id is empty or invalid)',
        })
        .end();
      return;
    }

    // TODO: payment Type 가 db에 있는 건지 체크 (Payment API 추가해야함.)
    // TODO: payment Type 이 현재 유저의 결제 타입인지 체크

    const categoryIdAsNumber = Number(categoryId);

    if (isNaN(categoryIdAsNumber)) {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_PARAMETER_INVALID + '(category id is empty or invalid)',
        })
        .end();
      return;
    }

    const category = await categoryService.getCategory(categoryIdAsNumber);
    if (!category) {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_CATEGORY_NOT_FOUND + `(id:${categoryIdAsNumber}).`,
        })
        .end();
      return;
    }

    const amountAsNumber = Number(amount);

    if (isNaN(amountAsNumber)) {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_PARAMETER_INVALID + '(amount is invalid)',
        })
        .end();
      return;
    }

    const ledgerDto: LedgerRequestDTO = {
      paymentTypeId: paymentTypeIdAsNumber,
      categoryId: categoryIdAsNumber,
      date,
      content,
      amount: amountAsNumber,
    };

    const newLedgerId = await LedgerService.createLedger(ledgerDto, userIdAsNumber);

    if (newLedgerId) {
      res
        .send({
          success: true,
          data: { id: newLedgerId },
        })
        .end();
    } else {
      res
        .status(SERVER_ERROR)
        .send({
          success: false,
          error: ERROR_CREATION_LEDGER_FAIL,
        })
        .end();
    }
  }

  // TODO: 수정, 삭제 API 추가.
}

export default new LedgerController();
