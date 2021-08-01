import LedgerContainer from '@/src/components/LedgerContainer';
import LedgerAddModal from '@/src/components/LedgerAddModal';
import Component from '@/src/core/Component';
import LedgerAddButton from '@/src/components/LedgerAddButton';

import './index.scss';
import LedgerDataModel from '@/src/models/Ledgers';
import CalendarModel from '@/src/models/Calendar';
import { ILedgerList } from '@/src/interfaces/Ledger';

interface IState {}

interface IProps {
  ledgerData: ILedgerList[];
}

export default class MainPage extends Component<IProps, IState> {
  setup() {
    this.$state.ledgerData = LedgerDataModel.getData();
  }
  template() {
    return /* html */ `
        <div id='body'></div>
        <div id="ledger-add-button"></div>
        <div id="ledger-add-modal"></div>
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

  setEvent() {
    const body = this.$target.querySelector('#body') as HTMLElement;
    CalendarModel.subscribe(async () => {
      await LedgerDataModel.update(CalendarModel.getDate());
      console.log(LedgerDataModel);
      new LedgerContainer(body, { ledgerData: LedgerDataModel.getData() });
    });
  }
}
