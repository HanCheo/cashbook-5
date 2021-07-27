import Component from '@/src/interfaces/Component';
import LedgerItem from '../LedgerItem';
import './index.scss';

export default class extends Component {
  setup() {
    this.$state = this.$props.state as ILedgerList;
  }

  template() {
    const state = this.$state as ILedgerList;

    return /*html*/ `
      <div class="ledger-wraper">
        <div class="ledger-header">
          <div class="ledger-date">${state.date} <span class="ledger-day">${state.day}</span></div>
          <div class="ledger-balance">
            ${state.income ? `수입 ${state.income}` : ``}&nbsp;
            ${state.spand ? `지출 ${state.spand}` : ``}
          </div>
        </div>
        <ul class="ledger-list" data-key=${state.numDate}></ul>
      </div>`;
  }

  render() {
    this.$target.insertAdjacentHTML('beforeend', this.template());
    this.mounted();
  }

  mounted() {
    const state = this.$state as ILedgerList;
    const target = this.$target.querySelector(`.ledger-list[data-key="${state.numDate}"]`) as HTMLElement;

    state.ledgers.forEach((ledger: ILedger) => {
      new LedgerItem(target, { state: ledger });
    });


  }
}



