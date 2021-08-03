import { CategoryResponseDTO } from './CategoryDTO';
import { PaymentTypeResponseDTO } from './PaymentTypeDTO';

export type LedgerRequestDTO = {
  paymentTypeId: number;
  categoryId: number;
  date: string;
  content: string;
  amount: number;
};

export type LedgerResponseDTO = {
  id: number;
  userId: number;
  categoryId: number;
  paymentTypeId: number;
  category: CategoryResponseDTO;
  paymentType: PaymentTypeResponseDTO;
  date: string;
  content: string;
  amount: number;
};
export interface LedgersDayGroupResponseDTO {
  date: string;
  numdate: string;
  income: number;
  ledgers: LedgerResponseDTO[];
  spand: number;
}

export type LedgerListResponseDTO = LedgerResponseDTO[];
