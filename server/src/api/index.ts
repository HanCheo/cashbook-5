import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.send('<h1>This is Test</h1>');
  res.end();
});

export default router;
