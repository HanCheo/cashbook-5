import LedgerContainer from '@/src/components/LedgerContainer';
import LedgerAddModal from '@/src/components/LedgerAddModal';
import Component from '@/src/core/Component';
import LedgerAddButton from '@/src/components/LedgerAddButton';

import './index.scss';
import LedgerDataModel from '@/src/models/Ledgers';
import CalendarModel from '@/src/models/Calendar';
import { ILedgerList } from '@/src/interfaces/Ledger';
import { converToYYYYMM, html } from '@/src/utils/codeHelper';
import Snackbar from '@/src/components/SnackBar';

interface IState {}

interface IProps {
  ledgerData: ILedgerList[] | undefined;
}
const CALENDAR_OBSERVER_LISTENER_KEY = 'main';
export default class MainPage extends Component<IProps, IState> {
  setup() {
    this.fetchInitLedgers();
  }

  async fetchInitLedgers() {
    await LedgerDataModel.update(converToYYYYMM(CalendarModel.getDate()));
    this.setState({ ledgerData: LedgerDataModel.getData() });
  }

  template() {
    return html`
      <div id="body"></div>
      <div id="ledger-add-button"></div>
      <div id="ledger-add-modal"></div>
      <div id="ledger-edit-modal"></div>
      <div id="card-add-modal"></div>
    `;
  }

  mounted() {
    const body = this.$target.querySelector('#body') as HTMLElement;
    const { ledgerData } = this.$state;
    new LedgerContainer(body, { ledgerData });

    const $addModal = this.$target.querySelector('#ledger-add-modal') as HTMLElement;
    const ledgerAddModal = new LedgerAddModal($addModal);

    const $addLedgerButton = this.$target.querySelector('#ledger-add-button') as HTMLElement;
    new LedgerAddButton($addLedgerButton, {
      onClick: () => ledgerAddModal.show(),
    });
  }

  async CalendarModelSubscribeFunction() {
    await LedgerDataModel.update(converToYYYYMM(CalendarModel.getDate()));

    const ledgerData = LedgerDataModel.getData();

    const body = this.$target.querySelector('#body') as HTMLElement;
    if (!ledgerData?.length) {
      new Snackbar(document.body, { text: '앗 ! 데이터가 없어요 !' });
    }
    new LedgerContainer(body, { ledgerData });
  }

  setUnmount() {
    CalendarModel.unsubscribe(CALENDAR_OBSERVER_LISTENER_KEY);
  }

  setEvent() {
    CalendarModel.subscribe(CALENDAR_OBSERVER_LISTENER_KEY, this.CalendarModelSubscribeFunction.bind(this));
    this.resetEvent();
  }
}
