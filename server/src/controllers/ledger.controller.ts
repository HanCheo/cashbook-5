import { Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS, UNAUTHORIZED } from '../utils/HttpStatus';
import { LedgerRequestDTO, LedgerResponseDTO } from '../dto/LedgerDTO';
import LedgerService from '../services/ledger.service';
import categoryService from '../services/category.service';

const ERROR_PARAMETER_INVALID = '입력 값이 잘못되었습니다.';
const ERROR_CATEGORY_NOT_FOUND = '카테고리를 찾을 수 없습니다.';
const ERROR_CREATION_LEDGER_FAIL = '가계부 데이터를 생성하는데 실패했습니다.';
const ERROR_LEDGER_NOT_FOUND = '가계부 데이터를 조회하는데 실패했습니다.';
const ERROR_UNAUTHORIZED_LEDGER = '가계부 데이터 조회에 대한 권한이 없습니다.';
const ERROR_UPDATE_LEDGER = '가계부 데이터를 수정하는데 실패했습니다.';

class LedgerController {
  async getLedger(req: Request, res: Response) {
    const userId = req.user.id!;
    const { id } = req.params;
    const idAsNumber = Number(id);

    if (isNaN(idAsNumber)) {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_PARAMETER_INVALID + '(id require number)',
        })
        .end();
      return;
    }

    const ledger = await LedgerService.getLedger(idAsNumber);
    if (ledger) {
      if (ledger.userId !== userId) {
        res
          .status(UNAUTHORIZED)
          .send({
            error: ERROR_UNAUTHORIZED_LEDGER,
          })
          .end();
      } else {
        res
          .status(SUCCESS)
          .send({
            success: true,
            data: ledger,
          })
          .end();
      }
    } else {
      res
        .status(NOT_FOUND)
        .send({
          error: ERROR_LEDGER_NOT_FOUND,
        })
        .end();
    }
  }

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

  async deleteLedger(req: Request, res: Response) {
    const userId = req.user.id!;
    const { id } = req.params;
    const idAsNumber = Number(id);

    if (isNaN(idAsNumber)) {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_PARAMETER_INVALID + '(id require number)',
        })
        .end();
      return;
    }

    const ledger = await LedgerService.getLedger(idAsNumber);
    if (!ledger) {
      res
        .status(NOT_FOUND)
        .send({
          error: ERROR_LEDGER_NOT_FOUND,
        })
        .end();
      return;
    }

    if (ledger.userId !== userId) {
      res
        .status(UNAUTHORIZED)
        .send({
          error: ERROR_UNAUTHORIZED_LEDGER,
        })
        .end();
      return;
    }

    const isSuccess = await LedgerService.deleteLedger(idAsNumber);
    if (isSuccess) {
      res
        .status(SUCCESS)
        .send({
          success: true,
        })
        .end();
    } else {
      res
        .status(SUCCESS)
        .send({
          success: false,
          error: '이미 삭제된 데이터 입니다.',
        })
        .end();
    }
  }

  async updateLedger(req: Request, res: Response) {
    const userId = req.user.id!;
    const { id } = req.params;
    const idAsNumber = Number(id);
    const { paymentTypeId, categoryId, date, content, amount } = req.body;

    if (isNaN(idAsNumber)) {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_PARAMETER_INVALID + '(id require number)',
        })
        .end();
      return;
    }
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

    const isSuccess = await LedgerService.updateLedger(idAsNumber, ledgerDto, userId);
    if (isSuccess) {
      res
        .status(SUCCESS)
        .send({
          success: true,
        })
        .end();
    } else {
      res
        .status(SUCCESS)
        .send({
          success: false,
          error: ERROR_UPDATE_LEDGER,
        })
        .end();
    }
  }
}

export default new LedgerController();
