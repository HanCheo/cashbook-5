import { CategoryDTO } from "./CategoryDTO";

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