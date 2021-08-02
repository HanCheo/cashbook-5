import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import wrapAsync from '../utils/wrap-async';

const categoryRouter = Router();

categoryRouter.get('/', wrapAsync(categoryController.getCategories));
categoryRouter.get('/:id', wrapAsync(categoryController.getCategory));

export default categoryRouter;
