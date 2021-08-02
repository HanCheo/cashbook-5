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
