import { Request, Response } from 'express';
import { BAD_REQUEST, SUCCESS } from '../utils/HttpStatus';
import categoryService from '../services/category.service';

const ERROR_PARAMETER_INVALID = "입력 값이 잘못되었습니다.";

class CategoryController {
    async getCategories(req: Request, res: Response) {
        const categories = await categoryService.getCategories();
        res.send({
            success: true,
            data: categories,
        });
    }

    async getCategory(req: Request, res: Response) {
        const { id } = req.params;
        const idAsNumber = Number(id);
        if (isNaN(idAsNumber)) {
            res.status(BAD_REQUEST).send({
                error: ERROR_PARAMETER_INVALID + "(category id parameter is invalid.)"
            });
            res.end();
            return;
        }

        const category = await categoryService.getCategory(idAsNumber);
        res.status(SUCCESS).send({
            success: true,
            data: category
        });
        res.end();
    }
}

const categoryController = new CategoryController();
export default categoryController;
