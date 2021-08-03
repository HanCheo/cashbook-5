import { CategoryResponseDTO } from '../dto/CategoryDTO';
import { LedgerRequestDTO, LedgerResponseDTO } from '../dto/LedgerDTO';
import { PaymentTypeResponseDTO } from '../dto/PaymentTypeDTO';
import LedgerRepository from '../repositories/ledger.repository';

class LedgerService {
  async getLedgersByMonth(date: Date, userId: number): Promise<LedgerResponseDTO[]> {

    const startDate = date;
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const ledgers = await LedgerRepository.userLedgersByMonth(startDate, endDate, userId);

    const ledgerDTOs: LedgerResponseDTO[] = ledgers.map(ledger => {
      const {
        id, userId, paymentTypeId, paymentType, categoryId, category, amount, date, content
      } = ledger;

      if (!category) {
        throw new Error("category가 존재하지않는 ledger 데이터가 존재합니다.")
      }

      const categoryDTO: CategoryResponseDTO = {
        id: category.id!,
        name: category.name,
        color: category.color,
      }

      if (!paymentType) {
        throw new Error("paymentType이 존재하지않는 Ledger 데이터가 존재합니다.");
      }

      const paymentTypeDTO: PaymentTypeResponseDTO = {
        id: paymentType.id!,
        name: paymentType.name,
        bgColor: paymentType.bgColor,
        fontColor: paymentType.bgColor,
      }

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
      }
    })

    return ledgerDTOs;
  }

  async createLedger(ledgerDto: LedgerRequestDTO, userId: number): Promise<number | null> {
    const {
      categoryId,
      paymentTypeId,
      date,
      content,
      amount
    } = ledgerDto;

    const newLedgerId = await LedgerRepository.createLedger(userId, categoryId, paymentTypeId, content, amount, date);
    if (newLedgerId) {
      return newLedgerId;
    } else {
      return null;
    }
  }
}

export default new LedgerService();
