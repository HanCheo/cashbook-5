interface Result<D> {
  success: boolean;
  data: D;
}

interface DateValueEntry {
  datetime: Date;
  value: number;
}

export interface StatisticLedgerByCategory {
  [category: string]: {
    entries: DateValueEntry[];
    total: number;
    color: string;
  };
}

export const getStatisticLedgers = async (): Promise<Result<StatisticLedgerByCategory>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          용돈: {
            entries: [
              { datetime: new Date('2021-08-27'), value: 10000 },
              { datetime: new Date('2021-08-28'), value: 30000 },
              { datetime: new Date('2021-08-29'), value: 50000 },
              { datetime: new Date('2021-08-30'), value: 10000 },
            ],
            total: 100000,
            color: '#000000',
          },
          적금: {
            entries: [
              { datetime: new Date('2021-08-27'), value: 10000 },
              { datetime: new Date('2021-08-28'), value: 20000 },
              { datetime: new Date('2021-08-29'), value: 50000 },
              { datetime: new Date('2021-08-30'), value: 80000 },
            ],
            total: 100000,
            color: '#ff0000',
          },
          예금: {
            entries: [
              { datetime: new Date('2021-08-27'), value: 10000 },
              { datetime: new Date('2021-08-28'), value: 30000 },
              { datetime: new Date('2021-08-29'), value: 70000 },
              { datetime: new Date('2021-08-30'), value: 80000 },
            ],
            total: 500000,
            color: '#00ff00',
          },
        },
      });
    }, 500);
  });
};
