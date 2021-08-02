import { LedgerDTO } from '../dto/LedgerDTO';
import Ledger from '../models/ledger.model';
import LedgerRepository from '../repositories/ledger.repository';

class LedgerService {
  async getLedgersByMonth(date: Date, userId: number): Promise<Ledger[]> {
    
    const startDate = date;
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const ledgers = await LedgerRepository.userLedgersByMonth(startDate, endDate, userId);
    return ledgers;
  }

}

export default new LedgerService();
