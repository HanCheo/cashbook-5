import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import wrapAsync from '../utils/wrap-async';

const categoryRouter = Router();

/**
 * GET /api/category
 * 현재 이용할 수 있는 전체 카테고리 조회
 */
categoryRouter.get('/', wrapAsync(categoryController.getCategories));

/**
 * GET /api/category/[id]
 * 카테고리 id를 이용해서 특정 카테고리 조회
 */
categoryRouter.get('/:id', wrapAsync(categoryController.getCategory));

export default categoryRouter;
