import { CategoryDTO } from "./CategoryDTO";

export type LedgerDTO = {
    id?: number;
    category: CategoryDTO;
    date: Date;
    content: string;
    amount: number;
}
