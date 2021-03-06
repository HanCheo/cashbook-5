import Category from "../models/category.model";


class CategoryRepository {
    async getCategories(): Promise<Category[]> {
        const allCategories = Category.findAll();
        return allCategories;
    }

    async getCategory(id: number): Promise<Category | null> {
        const category = Category.findOne({ where: { id } });
        return category;
    }

    // TODO add Ledgers by category API
}

const categoryRepository = new CategoryRepository();
export default categoryRepository;
