import { CategoryDTO } from '../dto/CategoryDTO';
import { LedgerRequestDTO, LedgerResponseDTO } from '../dto/LedgerDTO';
import LedgerRepository from '../repositories/ledger.repository';

class LedgerService {
  async getLedgersByMonth(date: Date, userId: number): Promise<LedgerResponseDTO[]> {

    const startDate = date;
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const ledgers = await LedgerRepository.userLedgersByMonth(startDate, endDate, userId);

    const ledgerDTOs: LedgerResponseDTO[] = ledgers.map(ledger => {
      const {
        id, userId, categoryId, category, amount, date, content
      } = ledger;

      if (!category) {
        throw new Error("category가 존재하지않는 ledger 데이터가 존재합니다.")
      }

      const categoryDTO: CategoryDTO = {
        id: category.id!,
        name: category.name,
        color: category.color,
      }

      return {
        id: id!,
        userId: userId!,
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
      date,
      content,
      amount
    } = ledgerDto;

    const newLedgerId = await LedgerRepository.createLedger(userId, categoryId, content, amount, date);
    if (newLedgerId) {
      return newLedgerId;
    } else {
      return null;
    }
  }
}

export default new LedgerService();
