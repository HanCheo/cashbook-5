import { NextFunction, Request, Response } from 'express';

const resErrorMsg = (res: Response, status: number, message: string) => {
  res.status(status || 500).json({
    error: message,
  });
};

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  resErrorMsg(res, err.status, err.message);
};

export default errorMiddleware;
