import { ILedger, ILedgerList } from '../interfaces/Ledger';
import { getFetch } from './fetch';
interface Result<D> {
  success: boolean;
  data: D;
}

export interface LedgerType {
  numDate: string;
  date: string;
  day: string;
  income: number;
  spand: number;
  ledgers: ILedger[];
}

export const getLedgerData = (date: string): Promise<Result<ILedgerList[]>> =>
  getFetch('/ledger/day', { query: { date: date }, headers: { contentType: 'application/json' } });
