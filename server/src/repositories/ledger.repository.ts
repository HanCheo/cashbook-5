import { Op } from 'sequelize';
import Ledger from '../models/ledger.model';
import Category from '../models/category.model';
import { LedgerDTO } from '../dto/LedgerDTO';
import User from '../models/user.model';

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

  async createLedger(userId: number, categoryId:number):Promise<Ledger>{
    const newLedger = await Ledger.create({
      userId,
      categoryId,
      date : new Date(),
      content: "TEST",
      amount : 1000
    });

    return newLedger;
  }
}

export default new LedgerRepository();
