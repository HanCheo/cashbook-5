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

/**
 * GET /api/ledger/day
 * 여러 YYYY/MM 데이터를 통해 필터링된 Ledger들을 day로 group한 데이터를 반환해주는 API
 */
ledgerRouter.get('/day', authJWT, wrapAsync(LedgerController.getLedgersGroupByDate));

/**
 * POST /api/ledger
 * 새로운 가계부 데이터 추가 
 */
ledgerRouter.post('/', authJWT, wrapAsync(LedgerController.createLedger));

export default ledgerRouter;
