import { ILedger, ILedgerList } from '../interfaces/Ledger';
import Observer from './Observer';

export class LedgerDataModel extends Observer {
  ledgerData: ILedgerList[];
  constructor() {
    super();
    this.ledgerData = [
      {
        numDate: '0727',
        date: '07월 27일',
        day: '화',
        income: 200000,
        spand: -150000,
        ledgers: [
          {
            categoryType: '6',
            category: '미분류',
            content: '온라인 세미나 신청',
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
        numDate: '0728',
        date: '07월 28일',
        day: '수',
        income: 300000,
        spand: -200000,
        ledgers: [
          {
            categoryType: '6',
            category: '미분류',
            content: '온라인 세미나 신청',
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
    ];
  }
  getData() {
    return this.ledgerData;
  }
  getIncomeData() {
    const data = JSON.parse(JSON.stringify(this.ledgerData));

    return data
      .filter((list: ILedgerList) => list.income > 0)
      .map((list: ILedgerList) => {
        list.ledgers = list.ledgers.filter((ledger: ILedger) => ledger.amount > 0);
        return list;
      });
  }
  getSpandData() {
    const data = JSON.parse(JSON.stringify(this.ledgerData));
    return data
      .filter((list: ILedgerList) => list.spand < 0)
      .map((list: ILedgerList) => {
        list.ledgers = list.ledgers.filter((ledger: ILedger) => ledger.amount < 0);
        return list;
      });
  }
  setDate(data: ILedgerList[]) {
    this.ledgerData = data;
    this.notify();
  }
}

const _model = new LedgerDataModel();
export default _model;
