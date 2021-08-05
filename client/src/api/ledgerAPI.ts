import { ILedger, ILedgerList } from '../interfaces/Ledger';
import { getFetch, postFetch, Result, putFetch, deleteFetch } from './fetch';

export interface LedgerType {
  numDate: string;
  date: string;
  day: string;
  income: number;
  spand: number;
  ledgers: ILedger[];
}

interface CreateLedgerResult {
  id: number;
}

export const getLedgerData = (date: string): Promise<Result<ILedgerList[]>> =>
  getFetch('/ledger/day', {
    query: { date },
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const createLedgerData = (
  date: string,
  paymentTypeId: number,
  categoryId: number,
  amount: number,
  content: string
): Promise<Result<CreateLedgerResult>> => {
  return postFetch('/ledger/', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date,
      paymentTypeId,
      categoryId,
      amount,
      content,
    }),
  });
};

export const getLedgerDataByID = (id: number): Promise<Result<ILedger>> => {
  return getFetch(`/ledger/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const editLedgerData = (
  id: number,
  date: string,
  paymentTypeId: number,
  categoryId: number,
  amount: number,
  content: string
): Promise<Result<undefined>> => {
  return putFetch(`/ledger/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      date,
      paymentTypeId,
      categoryId,
      amount,
      content,
    }),
  });
};

export const deleteLedgerData = (id: number): Promise<Result<undefined>> => {
  return deleteFetch(`/ledger/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  });
};
