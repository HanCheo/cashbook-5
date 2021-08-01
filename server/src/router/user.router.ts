import { Router } from 'express';
import authJWT from '../middleware/auth.middleware';
import UserController from '../../src/controllers/user.controller';
import wrapAsync from '../utils/wrap-async';

const userRouter = Router();

userRouter.get('/account', authJWT, UserController.getUser);

export default userRouter;
