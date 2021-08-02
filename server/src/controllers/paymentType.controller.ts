import { Request, Response } from 'express';
import { BAD_REQUEST, SERVER_ERROR, SUCCESS } from '../utils/HttpStatus';
import paymentTypeService from "../services/paymentType.service";
import { PaymentTypeRequestDTO } from '../dto/PaymentTypeDTO';

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

    getOwnPaymentTypes(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }

    deletePaymentType(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }
}

const paymentTypeController = new PaymentTypeController()
export default paymentTypeController;
