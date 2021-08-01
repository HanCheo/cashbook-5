import { ILedger } from '../interfaces/Ledger';

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

export const getLedgerData = async (date: Date): Promise<Result<LedgerType[]>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            numDate: '0627',
            date: '06월 26일',
            day: '화',
            income: 200000,
            spand: -150000,
            ledgers: [
              {
                categoryType: '6',
                category: '미분류',
                content: '아이 몰라몰라',
                cardType: '현금',
                amount: -100000,
              },
              {
                categoryType: '4',
                category: '식비',
                content: '저녁밥',
                cardType: '현대카드',
                amount: -50000,
              },
              {
                categoryType: '8',
                category: '월급',
                content: '7월 급여',
                cardType: '현급',
                amount: 200000,
              },
            ],
          },
          {
            numDate: '0628',
            date: '06월 25일',
            day: '수',
            income: 300000,
            spand: -200000,
            ledgers: [
              {
                categoryType: '6',
                category: '미분류',
                content: '아이 몰라몰라',
                cardType: '국민카드',
                amount: -150000,
              },
              {
                categoryType: '4',
                category: '식비',
                content: '저녁밥',
                cardType: '삼성카드',
                amount: -50000,
              },
              {
                categoryType: '8',
                category: '월급',
                content: '7월 보너스',
                cardType: '현급',
                amount: 300000,
              },
            ],
          },
        ],
      });
    }, 500);
  });
};
