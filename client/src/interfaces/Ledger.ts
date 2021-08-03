interface Category {
  color: string;
  id: number;
  name: string;
}
interface PaymentType {
  bgColor: string;
  fontColor: string;
  id: number;
  name: string;
}
export interface ILedger {
  categoryType: string;
  content: string;
  cardType: string;
  amount: number;
  category: Category;
  paymentType: PaymentType;
}

export interface ILedgerList {
  numDate: string; //mmdd 형태 list의 키로 사용하기 위함
  date: string; //mm월 dd일
  day: string; //요일
  income: number; //총수입
  spand: number; //총지출
  ledgers: ILedger[];
}

export interface IStatisticLedgerByDate {}

export interface IStatisticLedgerByCategory {}
