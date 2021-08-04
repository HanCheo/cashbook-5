import Component from '@/src/core/Component';
import { ILedger } from '@/src/interfaces/Ledger';
import { addComma, html } from '@/src/utils/codeHelper';
import './index.scss';

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
    const { name: categoryName, color: categoryColor } = ledger.category;
    const { name: paymentName } = ledger.paymentType;

    return html`
      <li class="ledger-list-item">
        <div class="ledger-category" style="background: ${categoryColor};">${categoryName}</div>
        <div class="ledger-content">${ledger.content}</div>
        <div class="ledger-cardType">${paymentName}</div>
        <div class="ledger-amount">
          <div>${addComma(ledger.amount)}</div>
          <div class="setting-buttons">
            <button class="edit">수정</button>
            <button class="delete">삭제</button>
          </div>
        </div>
      </li>
    `;
  }

  render() {
    this.$target.insertAdjacentHTML('beforeend', this.template());
    this.mounted();
  }
}
