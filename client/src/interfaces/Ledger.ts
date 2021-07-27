interface _Ledger {
  categoryType: string;
  category: string;
  content: string;
  cardType: string;
  balance: number;
}

interface _LedgerList {
  numDate: string; //mmdd 형태 list의 키로 사용하기 위함
  date: string; //mm월 dd일
  day: string; //요일
  income: number; //총수입
  spand: number; //총지출
  ledgers: _Ledger[];
}
