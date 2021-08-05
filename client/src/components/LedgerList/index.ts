import Component from '@/src/core/Component';
import { addComma, html } from '@/src/utils/codeHelper';
import LedgerItem from '../LedgerItem';
import { ILedger, ILedgerList } from '@/src/interfaces/Ledger';
import { YOIL_KOR } from '@/src/utils/calendar';
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
    const { date, income, spand, numDate } = ledgerList;
    const day = YOIL_KOR[new Date(date).getDay()];
    const monthDate = date.split('-').slice(1).join('월 ') + '일';

    return html` <div class="ledger-wraper">
      <div class="ledger-header">
        <div class="ledger-date">${monthDate} <span class="ledger-day">${day}</span></div>
        <div class="ledger-amount">
          ${income ? `수입 ${addComma(income)}` : ``}&nbsp; ${spand ? `지출 ${addComma(spand)}` : ``}
        </div>
      </div>
      <ul class="ledger-list" data-key=${numDate}></ul>
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
