import LedgerContainer from '@/src/components/LedgerContainer';
import LedgerAddModal from '@/src/components/LedgerAddModal';
import Component from '@/src/core/Component';
import LedgerAddButton from '@/src/components/LedgerAddButton';

import './index.scss';

interface IState {}

interface IProps {}

export default class MainPage extends Component<IProps, IState> {
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
    new LedgerContainer(body);

    const $addModal = this.$target.querySelector('#ledger-add-modal') as HTMLElement;
    const ledgerAddModal = new LedgerAddModal($addModal);

    const $addLedgerButton = this.$target.querySelector('#ledger-add-button') as HTMLElement;
    new LedgerAddButton($addLedgerButton, {
      onClick: () => ledgerAddModal.show(),
    });
  }
}
