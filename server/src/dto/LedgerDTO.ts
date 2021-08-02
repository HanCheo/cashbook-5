import { CategoryDTO } from "./CategoryDTO";
import { PaymentTypeResponseDTO } from "./PaymentTypeDTO";

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
    paymentType: PaymentTypeResponseDTO;
    date: Date;
    content: string;
    amount: number;
}

export type LedgerListResponseDTO = LedgerResponseDTO[];