import Component from '@/src/core/Component';
import { ILedger } from '@/src/interfaces/Ledger';

interface IState {
  ledger: ILedger;
}

interface IProps {
  ledger: ILedger;
}

export default class LedgerItem extends Component<IState, IProps> {
  setup() {
    const { ledger } = this.$props;
    this.$state = {
      ledger,
    };
  }

  template() {
    const { ledger } = this.$state;

    return /*html*/ `
      <li>
        <div class="ledger-category" data-category-type="${ledger.categoryType}">${ledger.category}</div>
        <div class="ledger-content" >${ledger.content}</div>
        <div class="ledger-cardType" >${ledger.cardType}</div>
        <div class="ledger-balance" >${ledger.balance}</div>
      </li>
    `;
  }

  render() {
    this.$target.insertAdjacentHTML('beforeend', this.template());
    this.mounted();
  }
}
