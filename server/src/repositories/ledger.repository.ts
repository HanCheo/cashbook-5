import { Op } from 'sequelize';
import Ledger from '../models/ledger.model';

class LedgerRepository {
  /**
   *
   * @param yearAndMonth "2020-09"
   * @param userId "1"
   */
  async userLedgersByMonth(startDate: Date, enddate: Date, userId: number): Promise<Ledger[]> {
    const Ledgers = await Ledger.findAll({
      where: {
        userId: userId,
        date: { [Op.between]: [startDate, enddate] },
      },
      raw: true,
    });

    return Ledgers;
  }
}

export default new LedgerRepository();
