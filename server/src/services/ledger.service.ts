import { CategoryResponseDTO } from '../dto/CategoryDTO';
import { LedgerRequestDTO, LedgerResponseDTO, LedgersDayGroupResponseDTO, StatisticEntry, StatisticLedgersResponseDTO } from '../dto/LedgerDTO';
import { PaymentTypeResponseDTO } from '../dto/PaymentTypeDTO';
import LedgerRepository from '../repositories/ledger.repository';
import categoryService from './category.service';

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
        throw new Error('category가 존재하지않는 ledger 데이터가 존재합니다.');
      }

      const categoryDTO: CategoryResponseDTO = {
        id: category.id!,
        name: category.name,
        color: category.color,
      };

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
      };
    });

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


  convertToDayGroupLedgers(ledgers: LedgerResponseDTO[]): LedgersDayGroupResponseDTO[] {
    const groupByDate = new Map();

    ledgers.forEach(ledger => {
      const _data = groupByDate.get(ledger.date);

      const income = _data?.income ? _data.income : 0;
      const spand = _data?.spand ? _data.spand : 0;
      const ledgers = _data?.ledgers ? _data.ledgers : [];

      const map = {
        date: ledger.date,
        numDate: ledger.date.split('-').slice(1).join(''),
        income: +ledger.amount > 0 ? income + ledger.amount : income,
        spand: +ledger.amount < 0 ? spand + ledger.amount : spand,
        ledgers: [...ledgers, ledger],
      };

      groupByDate.set(ledger.date, map);
    });

    return [...groupByDate.values()];
  }

  convertToStatisticLedgers(ledgers: LedgerResponseDTO[]): StatisticLedgersResponseDTO {
    const groupByCategory = new Map<string, LedgerResponseDTO[]>();

    ledgers.forEach(ledger => {
      const categoryName = ledger.category.name;
      const originLedgers = groupByCategory.get(categoryName);
      if (originLedgers === undefined) {
        groupByCategory.set(categoryName, [ledger]);
      } else {
        groupByCategory.set(categoryName, [...originLedgers, ledger]);
      }
    });

    const statisticLedgers: StatisticLedgersResponseDTO = {};

    for (const [category, data] of groupByCategory) {
      if (data) {
        const total = data.reduce((acc, curr) => acc + curr.amount, 0);
        const color = data[0].category.color;
        const entries: StatisticEntry[] = data.map(ledger => {
          return {
            datetime: new Date(ledger.date),
            amount: ledger.amount
          }
        })
        statisticLedgers[category] = {
          total,
          color,
          entries
        }
      }
    }

    return statisticLedgers;
  }
}

export default new LedgerService();
