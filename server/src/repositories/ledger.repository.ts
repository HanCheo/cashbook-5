import { Op } from 'sequelize';
import Ledger, { LedgersAttributes } from '../models/ledger.model';

class LedgerRepository {
  /**
   * Get Ledgers (between startDate and endDate)
   * @param startDate Date
   * @param endDate Date
   * @param userId number
   * @returns  Promise<Ledger[]>
   */
  async userLedgersByMonth(startDate: Date, endDate: Date, userId: number): Promise<Ledger[]> {
    const Ledgers = await Ledger.findAll({
      include: [
        Ledger.associations.category,
        Ledger.associations.user
      ],
      where: {
        userId: userId,
        date: { [Op.between]: [startDate, endDate] },
      },
    });

    return Ledgers;
  }

  /**
   * Ledger를 생성하는 API
   * @param userId 유저의 고유 식별자(id)
   * @param categoryId 카테고리의 고유 식별자(id)
   * @param content Ledger의 내용
   * @param amount Ledger의 비용 
   * @param date Ledger의 생성 일자
   * @returns 생성된 Ledger 데이터의 id
   */
  async createLedger(userId: number, categoryId: number, content: string, amount: number, date: Date): Promise<number | null> {
    const newLedger = await Ledger.create<Ledger>({
      userId,
      categoryId,
      date,
      content,
      amount
    }, {
      raw: true
    });
    if (newLedger) {
      return newLedger.id!;
    } else {
      return null;
    }
  }
}

export default new LedgerRepository();
