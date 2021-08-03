import { ILedger, ILedgerList } from '../interfaces/Ledger';
import { getFetch, postFetch, Result } from './fetch';

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

interface CreateLedgerResult {
  id: number
}

export const createLedgerData = async (
  date: string,
  paymentTypeId: number,
  categoryId: number,
  amount: number,
  content: string): Promise<Result<CreateLedgerResult>> => {

  return postFetch("/ledger/", {
    headers: {
      "Content-Type": 'application/json',
    },
    body: JSON.stringify({
      date,
      paymentTypeId,
      categoryId,
      amount,
      content
    })
  })
}