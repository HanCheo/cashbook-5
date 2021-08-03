import { getFetch } from "./fetch";

interface Result<D> {
  success: boolean;
  data: D;
}

interface DateValueEntry {
  datetime: Date;
  amount: number;
}

export interface StatisticLedgerByCategory {
  [category: string]: {
    entries: DateValueEntry[];
    total: number;
    color: string;
  };
}

export const getStatisticLedgers = async (date: Date): Promise<Result<StatisticLedgerByCategory>> => {
  const yearMonthQuery = `${date.getFullYear()}-${date.getMonth() + 1}` // YYYY-MM
  const result = await getFetch<Result<StatisticLedgerByCategory>>(`/ledger/statistic?date=${yearMonthQuery}`);
  return result;
};
