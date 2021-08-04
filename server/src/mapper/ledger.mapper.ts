import Ledger from '../models/ledger.model';
import { CategoryResponseDTO } from '../dto/CategoryDTO';
import { PaymentTypeResponseDTO } from '../dto/PaymentTypeDTO';
import { LedgerResponseDTO } from '../dto/LedgerDTO';

export const ledgerToLedgerResponseDTO = (ledger: Ledger): LedgerResponseDTO => {
  const { id, userId, paymentTypeId, paymentType, categoryId, category, amount, date, content } = ledger;
  if (!category) {
    throw new Error('category가 존재하지않는 ledger 데이터가 존재합니다.');
  }

  const categoryDTO: CategoryResponseDTO = {
    id: category.id!,
    name: category.name,
    color: category.color,
  };

  if (!paymentType) {
    throw new Error('paymentType이 존재하지않는 Ledger 데이터가 존재합니다.');
  }

  const paymentTypeDTO: PaymentTypeResponseDTO = {
    id: paymentType.id!,
    name: paymentType.name,
    bgColor: paymentType.bgColor,
    fontColor: paymentType.bgColor,
  };

  return {
    id: id!,
    userId: userId!,
    paymentTypeId: paymentTypeId!,
    paymentType: paymentTypeDTO,
    categoryId: categoryId!,
    category: categoryDTO,
    date: date!,
    content: content!,
    amount: amount!,
  };
};
