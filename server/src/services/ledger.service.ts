import {
  LedgerRequestDTO,
  LedgerResponseDTO,
  LedgersDayGroupResponseDTO,
  StatisticEntry,
  StatisticLedgersResponseDTO,
} from '../dto/LedgerDTO';
import { ledgerToLedgerResponseDTO } from '../mapper/ledger.mapper';
import LedgerRepository from '../repositories/ledger.repository';
import { range } from '../utils/arrayHelper';
import { days } from '../utils/dayHelper';

class LedgerService {
  async deleteLedger(id: number): Promise<boolean> {
    const countOfRemoveRows = await LedgerRepository.deleteLedger(id);
    return countOfRemoveRows > 0;
  }

  async getLedger(id: number): Promise<LedgerResponseDTO | null> {
    const ledger = await LedgerRepository.getLedger(id);
    return ledger ? ledgerToLedgerResponseDTO(ledger) : null;
  }

  async getLedgersByMonth(date: Date, userId: number): Promise<LedgerResponseDTO[]> {
    const startDate = date;
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const ledgers = await LedgerRepository.userLedgersByMonth(startDate, endDate, userId);
    const ledgerDTOs: LedgerResponseDTO[] = ledgers.map(ledger => ledgerToLedgerResponseDTO(ledger));
    return ledgerDTOs;
  }

  async getExpenseLedgersByMonth(date: Date, userId: number): Promise<LedgerResponseDTO[]> {
    const startDate = date;
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const ledgers = await LedgerRepository.userExpenseLedgersByMonth(startDate, endDate, userId);
    const ledgerDTOs: LedgerResponseDTO[] = ledgers.map(ledger => ledgerToLedgerResponseDTO(ledger));
    return ledgerDTOs;
  }

  async createLedger(ledgerDto: LedgerRequestDTO, userId: number): Promise<number | null> {
    const { categoryId, paymentTypeId, date, content, amount } = ledgerDto;

    const newLedgerId = await LedgerRepository.createLedger(userId, categoryId, paymentTypeId, content, amount, date);
    if (newLedgerId) {
      return newLedgerId;
    } else {
      return null;
    }
  }

  async updateLedger(id: number, ledgerDto: LedgerRequestDTO, userId: number): Promise<boolean> {
    const { categoryId, paymentTypeId, date, content, amount } = ledgerDto;
    try {
      await LedgerRepository.updateLedger(id, userId, categoryId, paymentTypeId, content, amount, date);
      return true;
    } catch (error) {
      console.error(error); // TODO: change logger
      return false;
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

  convertToStatisticLedgers(ledgers: LedgerResponseDTO[], yearAndMonthDate: Date): StatisticLedgersResponseDTO {
    const categoryAndLedgersMap = new Map<string, LedgerResponseDTO[]>();
    // Make category To ledger Map for preprocessing
    ledgers.forEach(ledger => {
      const categoryName = ledger.category.name;
      const originLedgers = categoryAndLedgersMap.get(categoryName);
      if (originLedgers === undefined) {
        categoryAndLedgersMap.set(categoryName, [ledger]);
      } else {
        categoryAndLedgersMap.set(categoryName, [...originLedgers, ledger]);
      }
    });

    // Make StatisticLedger Response
    const statisticLedgers: StatisticLedgersResponseDTO = {};

    const month = yearAndMonthDate.getMonth() + 1;
    const year = yearAndMonthDate.getFullYear();
    const countOfDay = days(month, year);

    categoryAndLedgersMap.forEach((ledgerListByCategory, categoryName) => {
      // category에 의해 분류된 ledgers들이 없으면 통계 데이터를 생성하지않는다.
      if (ledgerListByCategory.length === 0) return;
      const dayAndAmountMap = new Map<string, number>();
      const total = ledgerListByCategory.reduce((acc, curr) => acc + curr.amount, 0);
      const color = ledgerListByCategory[0].category.color;

      // populate amounts(0) in all day of target month.
      range(countOfDay).forEach((n: number) => {
        const day = n + 1;
        const formattedDay = day / 10 < 1 ? '0' + day : day;
        const formattedMonth = month / 10 < 1 ? '0' + month : month;
        const date = `${year}-${formattedMonth}-${formattedDay}`;
        dayAndAmountMap.set(date, 0);
      });

      // insert amounts by date;
      ledgerListByCategory.forEach(ledger => {
        const amountOfDay = dayAndAmountMap.get(ledger.date);
        if (!amountOfDay) {
          dayAndAmountMap.set(ledger.date, ledger.amount);
        } else {
          dayAndAmountMap.set(ledger.date, amountOfDay + ledger.amount);
        }
      });

      const entries: StatisticEntry[] = Array.from(dayAndAmountMap.entries()).map(([date, amountOfDay]) => {
        return {
          datetime: new Date(date),
          amount: Math.abs(amountOfDay),
        };
      });

      statisticLedgers[categoryName] = {
        total: Math.abs(total),
        color,
        entries,
      };
    });
    return statisticLedgers;
  }
}

export default new LedgerService();
