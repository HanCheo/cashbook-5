import { ILedger, ILedgerList } from '../interfaces/Ledger';
import { getFetch, Result } from './fetch';

export interface LedgerType {
  numDate: string;
  date: string;
  day: string;
  income: number;
  spand: number;
  ledgers: ILedger[];
}

export const getLedgerData = (date: string): Promise<Result<ILedgerList[]>> =>
  getFetch('/ledger/day', {
    query: { date }, headers: {
      "Content-Type": 'application/json',
    }
  });
