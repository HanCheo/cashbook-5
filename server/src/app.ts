import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import router from './api/index';

dotenv.config({ path: './config/.env' });

const port: number = Number(process.env.PORT) || 3000;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

app.use(router);

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error('Not Found') as any;
  err.status = 404;
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Express server listening at ${port}`);
});
