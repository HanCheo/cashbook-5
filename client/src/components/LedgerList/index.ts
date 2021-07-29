import Component from '@/src/core/Component';
import { addComma, html } from '@/src/utils/codeHelper';
import LedgerItem from '../LedgerItem';
import { ILedger, ILedgerList } from '@/src/interfaces/Ledger';

import './index.scss';

interface IState {
  ledgerList: ILedgerList;
}

interface IProps {
  ledgerList: ILedgerList;
}

export default class LedgerList extends Component<IState, IProps> {
  setup() {
    const { ledgerList } = this.$props;

    this.$state = {
      ledgerList,
    };
  }

  template() {
    const { ledgerList } = this.$state;

    return html` <div class="ledger-wraper">
      <div class="ledger-header">
        <div class="ledger-date">${ledgerList.date} <span class="ledger-day">${ledgerList.day}</span></div>
        <div class="ledger-amount">
          ${ledgerList.income ? `수입 ${addComma(ledgerList.income)}` : ``}&nbsp;
          ${ledgerList.spand ? `지출 ${addComma(ledgerList.spand)}` : ``}
        </div>
      </div>
      <ul class="ledger-list" data-key=${ledgerList.numDate}></ul>
    </div>`;
  }

  render() {
    this.$target.insertAdjacentHTML('beforeend', this.template());
    this.mounted();
  }

  mounted() {
    const { ledgerList } = this.$state;

    const target = this.$target.querySelector(`.ledger-list[data-key="${ledgerList.numDate}"]`) as HTMLElement;

    ledgerList.ledgers.forEach((ledger: ILedger) => {
      new LedgerItem(target, { ledger });
    });
  }
}
