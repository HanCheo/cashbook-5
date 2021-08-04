import { Category } from "../interfaces/Category";
import { getFetch, Result } from "./fetch";

export const getCategoriesAsync = async (): Promise<Result<Category[]>> => {
    return await getFetch("/category");
};
