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
 * GET /api/ledger/statistic
 * 통계를 위한 Ledger Data를 반환해줍니다.
 */
ledgerRouter.get('/statistic', authJWT, wrapAsync(LedgerController.getStatisticExpenseLedgersByDate));

/**
 * POST /api/ledger
 * 새로운 가계부 데이터 추가
 */
ledgerRouter.post('/', authJWT, wrapAsync(LedgerController.createLedger));

/**
 * GET /api/ledger/:id
 * Ledger Id를 이용해서 Ledger를 조회합니다.
 */
ledgerRouter.get('/:id', authJWT, wrapAsync(LedgerController.getLedger));

/**
 * PUT /api/ledger/:id
 * Ledger API
 */
ledgerRouter.put('/:id', authJWT, wrapAsync(LedgerController.updateLedger));

/**
 * DELETE /api/ledger/:id
 */
ledgerRouter.delete('/:id', authJWT, wrapAsync(LedgerController.deleteLedger));

export default ledgerRouter;
