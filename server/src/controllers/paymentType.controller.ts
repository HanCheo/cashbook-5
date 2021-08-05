import { Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS, UNAUTHORIZED } from '../utils/HttpStatus';
import paymentTypeService from '../services/paymentType.service';
import { PaymentTypeRequestDTO } from '../dto/PaymentTypeDTO';

const ERROR_RETRIEVE_USER_PAYMENTS_FAIL = '사용자의 결제 수단을 가져오는데 실패했습니다.';
const ERROR_CREATE_USER_PAYMENTS_FAIL = '사용자의 결제 수단을 가져오는데 실패했습니다.';
const ERROR_DELETE_USER_PAYMENTS_FAIL = '사용자의 결제 수단을 삭제하는데 실패했습니다.';
const ERROR_PARAMETER_INVALID = '입력 값이 잘못되었습니다.';

class PaymentTypeController {
  async createPaymentType(req: Request, res: Response) {
    // Assert User Id is valid.
    const userIdAsNumber = Number(req.user.id);

    const { name, bgColor, fontColor } = req.body;

    if (!name || name === '') {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_PARAMETER_INVALID + '(name is empty or invalid.)',
        })
        .end();
      return;
    }

    const paymentType: PaymentTypeRequestDTO = {
      name,
      bgColor,
      fontColor,
    };

    // TODO: bgColor, fontColor format ("#ffffff") 체크필요.
    const paymentTypeId = await paymentTypeService.createPaymentType(paymentType, userIdAsNumber);

    if (paymentTypeId) {
      res.status(SUCCESS).send({
        success: true,
        data: paymentTypeId,
      });
    } else {
      res.status(SERVER_ERROR).send({
        success: false,
        error: ERROR_CREATE_USER_PAYMENTS_FAIL,
      });
    }
  }

  async getOwnPaymentTypes(req: Request, res: Response) {
    const userIdAsNumber = Number(req.user.id);
    try {
      const paymentTypes = await paymentTypeService.getOwnPaymentTypes(userIdAsNumber);
      res.status(SUCCESS).send({
        success: true,
        data: paymentTypes,
      });
    } catch (error) {
      console.log(error); // TODO: change to logger
      res.status(SERVER_ERROR).send({
        error: ERROR_RETRIEVE_USER_PAYMENTS_FAIL,
      });
    }
  }

  async deletePaymentType(req: Request, res: Response) {
    const { id } = req.params;

    const paymentIdAsNumber = Number(id);
    if (isNaN(paymentIdAsNumber)) {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_PARAMETER_INVALID + `(${id} is empty or invalid)`,
        })
        .end();
      return;
    }

    const userIdAsNumber = Number(req.user.id);

    try {
      const isOwn = await paymentTypeService.isOwnPaymentType(paymentIdAsNumber, userIdAsNumber);
      if (!isOwn) {
        res
          .status(UNAUTHORIZED)
          .send({
            error: ERROR_DELETE_USER_PAYMENTS_FAIL,
          })
          .end();
        return;
      }
    } catch (error) {
      res
        .status(BAD_REQUEST)
        .send({
          error: ERROR_DELETE_USER_PAYMENTS_FAIL + ' ' + error,
        })
        .end();
      return;
    }

    const isDelete = await paymentTypeService.deletePaymentType(paymentIdAsNumber);
    res
      .status(SUCCESS)
      .send({
        success: isDelete,
      })
      .end();
  }
}

const paymentTypeController = new PaymentTypeController();
export default paymentTypeController;
