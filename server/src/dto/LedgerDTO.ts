import { CategoryDTO } from "./CategoryDTO";
import { PaymentTypeDTO } from "./PaymentTypeDTO";

export type LedgerRequestDTO = {
    paymentTypeId: number;
    categoryId: number;
    date: Date;
    content: string;
    amount: number;
}

export type LedgerResponseDTO = {
    id: number;
    userId: number;
    categoryId: number;
    paymentTypeId: number;
    category: CategoryDTO;
    paymentType: PaymentTypeDTO;
    date: Date;
    content: string;
    amount: number;
}

export type LedgerListResponseDTO = LedgerResponseDTO[];