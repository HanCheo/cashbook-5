import { Router } from 'express';
import authJWT from '../middleware/auth.middleware';
import LedgerController from '../../src/controllers/ledger.controller';
import wrapAsync from '../utils/wrap-async';

const ledgerRouter = Router();

/**
 * GET /api/ledger
 * 여러 YYYY/MM 데이터를 통해 필터링된 Ledger들을 반환해주는 API
 */
ledgerRouter.get('/', authJWT, wrapAsync(LedgerController.getLedgersByDate));

export default ledgerRouter;
