import Component from '@/src/core/Component';

export default class LedgerItem extends Component {
  setup() {
    this.$state = this.$props.state as ILedger;
  }

  template() {
    const state = this.$state as ILedger;

    return /*html*/ `
      <li>
        <div class="ledger-category" data-category-type="${state.categoryType}">${state.category}</div>
        <div class="ledger-content" >${state.content}</div>
        <div class="ledger-cardType" >${state.cardType}</div>
        <div class="ledger-balance" >${state.balance}</div>
      </li>
    `;
  }

  render() {
    this.$target.insertAdjacentHTML('beforeend', this.template());
    this.mounted();
  }
}
