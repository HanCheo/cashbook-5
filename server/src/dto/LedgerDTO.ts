import Category from "../models/category.model";
import { CategoryDTO } from "./CategoryDTO";
import { UserDTO } from "./UserDTO";

export type LedgerRequestDTO = {
    categoryId: number;
    date: Date;
    content: string;
    amount: number;
}

export type LedgerResponseDTO = {
    id: number;
    userId: number;
    categoryId: number;
    category: CategoryDTO;
    date: Date;
    content: string;
    amount: number;
}

export type LedgerListResponseDTO = LedgerResponseDTO[];