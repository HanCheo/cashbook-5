import { Router } from 'express';
import authJWT from '../middleware/auth.middleware';
import LedgerController from '../../src/controllers/ledger.controller';
import wrapAsync from '../utils/wrap-async';

const ledgerRouter = Router();

ledgerRouter.post('/data', authJWT, wrapAsync(LedgerController.getLedgers));

export default ledgerRouter;
