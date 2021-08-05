import { Router } from 'express';
import paymentTypeController from '../controllers/paymentType.controller';
import authJWT from '../middleware/auth.middleware';
import wrapAsync from '../utils/wrap-async';

const paymentTypeRouter = Router();

/**
 * GET /api/paymentType
 * 현재 유저가 가지고 있는 Payment Type들을 조회합니다.
 */
paymentTypeRouter.get('/', authJWT, wrapAsync(paymentTypeController.getOwnPaymentTypes));

/**
 * POST /api/paymentType
 * 현재 유저에 새로운 paymentType을 추가합니다.
 */
paymentTypeRouter.post('/', authJWT, wrapAsync(paymentTypeController.createPaymentType));

/**
 * DELETE /api/paymentType/:id
 * 현재 유저의 결제수단(id를 가진)을 제거합니다.
 */
paymentTypeRouter.delete("/:id", authJWT, wrapAsync(paymentTypeController.deletePaymentType));

export default paymentTypeRouter;
