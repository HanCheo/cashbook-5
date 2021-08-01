import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from '../middleware/error.middleware';
import apiRouter from '../router/index';
import env from '../config';

const CORS_OPTION = {
  origin: [env.DEV_CLIENT_URL, env.AWS_CLIENT_URL], // 접근 권한을 부여하는 도메인
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가 for JWT http access
};

export default ({ app }: { app: Application }) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors(CORS_OPTION));
  app.use(morgan('dev'));

  app.use('/api', apiRouter);

  app.use((req, res, next) => {
    const err = new Error('Not Found') as any;
    err['status'] = 404;
    next(err);
  });

  app.use(errorMiddleware);
};
