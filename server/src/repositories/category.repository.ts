import Category from "../models/category.model";


class CategoryRepository {
    async getCategories(): Promise<Category[]> {
        const allCategories = Category.findAll();
        return allCategories;
    }

    async getCategory(id: number): Promise<Category | null> {
        const category = Category.findOne({ where: { id } });
        if (category) {
            return category
        } else {
            return null;
        }
    }

    // TODO add Ledgers by category.

}


const categoryRepository = new CategoryRepository();
export default categoryRepository;
