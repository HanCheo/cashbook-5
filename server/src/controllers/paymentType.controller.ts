import { Request, Response } from 'express';

class PaymentTypeController {
    deletePaymentType(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }
    createPaymentType(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }
    getOwnPaymentTypes(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }
}

const paymentTypeController = new PaymentTypeController()
export default paymentTypeController;
