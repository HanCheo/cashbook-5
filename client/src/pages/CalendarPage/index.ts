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
const CALENDAR_OBSERVER_LISTENER_KEY = 'calendar';
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
    CalendarModel.unsubscribe(CALENDAR_OBSERVER_LISTENER_KEY);
  }

  async CalendarModelSubscribeFunction() {
    const target = this.$target.querySelector('.calendar-wrapper') as HTMLElement;
    const date = CalendarModel.getDate();
    await LedgerDataModel.update(date.getFullYear() + '-' + (date.getMonth() + 1));
    new Calendar(target, { ledgerData: LedgerDataModel.getData(), date: CalendarModel.getDate() });
  }

  setEvent() {
    CalendarModel.subscribe(CALENDAR_OBSERVER_LISTENER_KEY, this.CalendarModelSubscribeFunction.bind(this));
    this.resetEvent();
  }
}
