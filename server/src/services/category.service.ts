import { CategoryResponseDTO } from "../dto/CategoryDTO";
import categoryRepository from "../repositories/category.repository";

class CategoryService {
    async getCategories(): Promise<CategoryResponseDTO[]> {
        const categories = await categoryRepository.getCategories();
        return categories.map(category => {
            return {
                id: category.id!,
                name: category.name,
                color: category.color
            }
        });
    }

    async getCategory(id: number): Promise<CategoryResponseDTO | null> {
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