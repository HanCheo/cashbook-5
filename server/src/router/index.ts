import { Router } from 'express';
import authRouter from './auth.router';
import categoryRouter from './category.router';
import ledgerRouter from './ledger.router';
import paymentTypeRouter from './paymentType.router';
import userRouter from './user.router';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/ledger', ledgerRouter);
apiRouter.use('/category', categoryRouter);
apiRouter.use("/paymentType", paymentTypeRouter);

export default apiRouter;
