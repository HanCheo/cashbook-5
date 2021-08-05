import Calendar from '@/src/components/Calendar';
import Component from '@/src/core/Component';
import { ILedgerList } from '@/src/interfaces/Ledger';
import CalendarModel from '@/src/models/Calendar';
import LedgerDataModel from '@/src/models/Ledgers';
import { converToYYYYMM } from '@/src/utils/codeHelper';
import './index.scss';

interface IState {
  ledgerData: ILedgerList[] | undefined;
  date: Date;
}
interface IProps {}
const CALENDAR_OBSERVER_LISTENER_KEY = 'calendar';
export default class CalendarPages extends Component<IState, IProps> {
  setup() {
    this.$state = {
      ledgerData: [],
      date: CalendarModel.getDate(),
    };
    this.fetchInitLedgers();
  }

  async fetchInitLedgers() {
    await LedgerDataModel.update(converToYYYYMM(CalendarModel.getDate()));
    this.setState({ ledgerData: LedgerDataModel.getData(), date: CalendarModel.getDate() });
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
    await LedgerDataModel.update(converToYYYYMM(date));
    new Calendar(target, { ledgerData: LedgerDataModel.getData(), date });
  }

  setEvent() {
    CalendarModel.subscribe(CALENDAR_OBSERVER_LISTENER_KEY, this.CalendarModelSubscribeFunction.bind(this));
    this.resetEvent();
  }
}
