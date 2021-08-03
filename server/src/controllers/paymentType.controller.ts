import { Request, Response } from 'express';
import { BAD_REQUEST, SERVER_ERROR, SUCCESS } from '../utils/HttpStatus';
import paymentTypeService from "../services/paymentType.service";
import { PaymentTypeRequestDTO } from '../dto/PaymentTypeDTO';


const ERROR_RETRIEVE_USER_PAYMENTS_FAIL = "사용자의 결제 수단을 가져오는데 실패했습니다.";

class PaymentTypeController {
    async createPaymentType(req: Request, res: Response) {
        // Assert User Id is valid.
        const userIdAsNumber = Number(req.user.id);

        const {
            name,
            bgColor,
            fontColor,
        } = req.body;

        if (!name || name === "") {
            res.status(BAD_REQUEST).send({
                error: "name is empty or invalid."
            }).end();
            return;
        }

        const paymentType: PaymentTypeRequestDTO = {
            name,
            bgColor,
            fontColor
        };

        // TODO: bgColor, fontColor format ("#ffffff") 체크필요.
        const paymentTypeId = await paymentTypeService.createPaymentType(paymentType, userIdAsNumber);

        if (paymentTypeId) {
            res.status(SUCCESS).send({
                success: true,
                data: paymentTypeId
            })
        } else {
            res.status(SERVER_ERROR).send({
                success: false,
                error: "PaymentType Creation is fail."
            })
        }
    }

    async getOwnPaymentTypes(req: Request, res: Response) {
        const userIdAsNumber = Number(req.user.id);
        try {
            const paymentTypes = await paymentTypeService.getOwnPaymentTypes(userIdAsNumber);
            res.status(SUCCESS).send({
                success: true,
                data: paymentTypes
            });
        } catch (error) {
            console.log("Error: " + error); // TODO: change to logger
            res.status(SERVER_ERROR).send({
                error: ERROR_RETRIEVE_USER_PAYMENTS_FAIL
            })
        }
    }

    deletePaymentType(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }
}

const paymentTypeController = new PaymentTypeController()
export default paymentTypeController;
