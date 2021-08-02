import { CategoryDTO } from "../dto/CategoryDTO";
import categoryRepository from "../repositories/category.repository";

class CategoryService {
    async getCategories(): Promise<CategoryDTO[]> {
        const categories = await categoryRepository.getCategories();
        return categories.map(category => {
            return {
                id: category.id!,
                name: category.name,
                color: category.color
            }
        });
    }

    async getCategory(id: number): Promise<CategoryDTO | null> {
        const category = await categoryRepository.getCategory(id);
        if (category) {
            return {
                id: category.id!,
                name: category.name,
                color: category.color
            }
        } else {
            return null;
        }
    }
}

const categoryService = new CategoryService();

export default categoryService;