import Calendar from '@/src/components/Calendar';
import Component from '@/src/core/Component';
import { ILedgerList } from '@/src/interfaces/Ledger';
import CalendarModel from '@/src/models/Calendar';
import LedgerDataModel from '@/src/models/Ledgers';
import './index.scss';

interface IState {
  ledgerData: ILedgerList[] | undefined;
  date: Date;
}
interface IProps {}

export default class CalendarPages extends Component<IState, IProps> {
  setup() {
    this.$state.ledgerData = LedgerDataModel.getData();
    this.$state.date = CalendarModel.getDate();
  }

  template() {
    return `<div class="calendar-wrapper"></div>`;
  }

  mounted() {
    const target = this.$target.querySelector('.calendar-wrapper') as HTMLElement;
    const { ledgerData, date } = this.$state;
    new Calendar(target, { ledgerData, date });
  }

  setUnmount() {
    CalendarModel.unsubscribe('calendar');
  }

  async CalendarModelSubscribeFunction() {
    const target = this.$target.querySelector('.calendar-wrapper') as HTMLElement;
    const date = CalendarModel.getDate();
    await LedgerDataModel.update(date.getFullYear() + '-' + (date.getMonth() + 1));
    new Calendar(target, { ledgerData: LedgerDataModel.getData(), date: CalendarModel.getDate() });
  }

  setEvent() {
    CalendarModel.subscribe('calendar', this.CalendarModelSubscribeFunction.bind(this));
    this.resetEvent();
  }
}
