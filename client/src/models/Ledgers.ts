import { getLedgerData } from '../api/ledgerAPI';
import { ILedger, ILedgerList } from '../interfaces/Ledger';
import Observer from './Observer';

export class LedgerDataModel extends Observer {
  ledgerData: ILedgerList[] | undefined;
  constructor() {
    super();
    this.ledgerData;
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
  setData(data: ILedgerList[]) {
    this.ledgerData = data;
    this.notify();
  }
  async update(date: string) {
    //TODO LEDGERS DATA UPDATE
    const newLedgerData = (await getLedgerData(date)).data;
    this.setData(newLedgerData);
  }
}
const model = new LedgerDataModel();
export default model;
